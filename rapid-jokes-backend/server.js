// Imports
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // See https://www.mongodb.com/docs/drivers/node/current/quick-start/
const cors = require('cors')
const http = require('http');
const bodyParser = require('body-parser');
const config = require('./config');

// Set up App
const app = express();
app.use(cors()); // Allow all cross-origing requests. More information: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(express.static('public')); // Host all static files in the folder /public
app.use(bodyParser.json()); // Support json encoded bodies
const port = process.env.PORT || '3001'; // Use the PORT variable if set (e.g., when deploying to Heroku)
app.set('port', port);

const server = http.createServer(app);


// Create the client and connect to the database
let database;
const client = new MongoClient(config.mongodb_connection_string);
client.connect((error, db) => {
    if (error || !db) {
        console.log("Could not connect to MongoDB:")
        console.log(error.message);
    }
    else {
        database = db.db('voting_jokes');
        console.log("Successfully connected to MongoDB.");
    }
})

//##################################################################################################
// ENDPOINTS 
//##################################################################################################

// VOTING ENDPOINTS
//--------------------------------------------------------------------------------------------------
// Get all votings
//--------------------------------------------------------------------------------------------------
app.get('/api/votings', async (req, res) => {
    try {
        const votingsCollection = database.collection('votings');
        const authorsCollection = database.collection('authors');
        const jokesCollection = database.collection('jokes');

        const votings = await votingsCollection.find().toArray();

        const pendingVotings = votings.map(async (voting) => {
            voting.votingAuthor = await authorsCollection.findOne({_id: voting.votingAuthor})
            voting.jokeId = await jokesCollection.findOne({_id: voting.jokeId})
            return voting;
        })
        const resolvedVotings = await Promise.all(pendingVotings)
        res.send(resolvedVotings);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// get voting by its id
app.get('/api/votings/:id', async (req, res) => {
    try {
        const id = ObjectId(req.params.id);

        const votingsCollection = database.collection('votings');
        const authorsCollection = database.collection('authors');
        const jokesCollection = database.collection('jokes');

        const voting = await votingsCollection.findOne({_id: id});

        if (!voting) {
            return res.status(404).send({message: 'voting with that id not found'});
        }
        voting.votingAuthor = await authorsCollection.findOne({_id: voting.votingAuthor});
        voting.jokeId = await jokesCollection.findOne({_id: voting.jokeId});

        res.send(voting);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})

// create new voting
app.post('/api/votings', async (req, res) => {
    try {
        const votingsCollection = database.collection('votings');
        const authorsCollection = database.collection('authors');
        const jokesCollection = database.collection('jokes');
        const authorId = ObjectId(req.body.votingAuthor);
        const jokeId = ObjectId(req.body.jokeId);
        const voting = {
            createdDate: req.body.createdDate,
            humorRate: req.body.humorRate,
            creativityRate: req.body.creativityRate,
            comment: req.body.comment,
            votingAuthor: authorId,
            jokeId: jokeId
        }

        const humorWeight = 0.6;
        const creativityWeight = 0.4;

        const votedJoke = await jokesCollection.findOne(jokeId);
        const newHumorRanking = votedJoke.humorRanking + req.body.humorRate;
        const newCreativityRanking = votedJoke.creativityRanking + req.body.creativityRate;
        const newOverallRanking = (newHumorRanking * humorWeight + newCreativityRanking * creativityWeight) / (humorWeight + creativityWeight);
        const roundedOverallRanking = Math.round(newOverallRanking * 10) / 10; // round to 1 decimal place
        const createdVoting = await votingsCollection.insertOne(voting);
        await authorsCollection.updateOne({_id: ObjectId(authorId)}, {$addToSet: {votings: createdVoting.insertedId}});
        await jokesCollection.updateOne(
        {_id: ObjectId(jokeId)}, 
        {
            $set: {
                humorRanking: newHumorRanking,
                creativityRanking: newCreativityRanking,
                overallRanking: roundedOverallRanking
            },
            $addToSet: {votingIds: createdVoting.insertedId}
        });
        res.status(201).send({_id: createdVoting.insertedId})
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})



// AUTHOR ENDPOINTS
//--------------------------------------------------------------------------------------------------
// Get all authors
//--------------------------------------------------------------------------------------------------
app.get('/api/authors', async (req, res) => {
    try {
        const collection = database.collection('authors');

        const result = await collection.find().toArray();
        res.send(result);

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})

//--------------------------------------------------------------------------------------------------
// Get an author by their id
//--------------------------------------------------------------------------------------------------
app.get('/api/authors/:id', async (req, res) => {

    // read the path parameter :id
    let id = req.params.id;
    try {
        const authorsCollection = database.collection('authors');
        const jokesCollection = database.collection('jokes');
        const votingsCollection = database.collection('votings');
        const votingsQuery = {votingAuthor: {$eq: ObjectId(id)}}
        const authorQuery = { _id: ObjectId(id) };
        const jokesQuery = { authorIds: { $eq: ObjectId(id) }  }; 
        const jokeResultCursor = await jokesCollection.find(jokesQuery).sort({"createdDate": 1}).limit(1);
        const jokeResult = await jokeResultCursor.toArray();
        const authorResult = await authorsCollection.findOne(authorQuery);
        const votingResult = await votingsCollection.find(votingsQuery).toArray();
        
        const transformedVotings = votingResult.map(async (voting) => {
            voting.jokeId = await jokesCollection.findOne({_id: voting.jokeId});
            return voting;
        })
        const votingsResult = await Promise.all(transformedVotings);

        if (!authorResult) {
            return res.status(404).send({message: 'author with that id not found'});
        }
            res.send({jokeResult, authorResult, votingsResult});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})

//--------------------------------------------------------------------------------------------------
// Create a new author
//--------------------------------------------------------------------------------------------------
app.post('/api/authors', async (req, res) => {

    try {
        const collection = database.collection('authors');

        var author = {
            name: req.body.name,
            age: req.body.age,
            humorPreferences: req.body.humorPreferences,
            jokes: req.body.jokes,
            votings: req.body.votings
        };
        const result = await collection.insertOne(author);

        res.status(201).send({ _id: result.insertedId });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})




// JOKES ENDPOINTS
//--------------------------------------------------------------------------------------------------
// Get all jokes
//--------------------------------------------------------------------------------------------------
app.get('/api/jokes', async (req, res) => {
    try {
        const collection = database.collection('jokes');

        const result = await collection.find().toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})


//--------------------------------------------------------------------------------------------------
// Get a joke by its id
//--------------------------------------------------------------------------------------------------
app.get('/api/jokes/:id', async (req, res) => {

    let jokeId = req.params.id;
    try {
        const jokesCollection = database.collection('jokes');
        const authorsCollection = database.collection('authors');
        const votingsCollection = database.collection('votings');
        const authorQuery = { jokes: { $eq: ObjectId(jokeId) }  }; 
        const votingQuery = {jokeId: ObjectId(jokeId)}
        const jokeQuery = { _id: ObjectId(jokeId) };
        const joke = await jokesCollection.findOne(jokeQuery);
        const authors = await authorsCollection.find(authorQuery).toArray();
        const votings = await votingsCollection.find(votingQuery).toArray();


        const transformedVotings = votings.map(async (voting) => {
            voting.votingAuthor = await authorsCollection.findOne({_id: voting.votingAuthor});
            return voting;
        })
        const resultVotings = await Promise.all(transformedVotings);
        if (!joke) {
           return res.status(404).send({message: 'joke with that id not found'});
        }
        res.send({joke, authors, resultVotings});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})

//--------------------------------------------------------------------------------------------------
// Get all jokes of an aouthor
//--------------------------------------------------------------------------------------------------
app.get('/api/jokes/myJokes/:id', async (req, res) => {
    let authorId = req.params.id;
    try {
        const jokesCollection = database.collection('jokes');
        const authorsCollection = database.collection('authors');
        const jokesQuery = { authorIds: { $eq: ObjectId(authorId) }  };
        const authorQuery = { _id: ObjectId(authorId) };
        const jokes = await jokesCollection.find(jokesQuery).toArray();
        const author = await authorsCollection.findOne(authorQuery);
        if (!author) {
           return res.status(404).send({message: 'author with that id not found'});
        }
        res.status(200).send({jokes, author});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})

//--------------------------------------------------------------------------------------------------
// Post an joke
//--------------------------------------------------------------------------------------------------
app.post('/api/jokes', async (req, res) => {
    try {
        const jokesCollection = database.collection('jokes');
        const authorsCollection = database.collection('authors');
        const authorsIds = req.body.authorIds;
        const newAuthorIds = authorsIds.map(authorId => {
            return ObjectId(authorId);
        })
        const joke = {
            jokeTitle: req.body.jokeTitle,
            jokeText: req.body.jokeText,
            humorType: req.body.humorType,
            createdDate: req.body.createdDate,
            humorRanking: req.body.humorRanking,
            creativityRanking: req.body.creativityRanking,
            overallRanking: req.body.overallRanking,
            authorIds: newAuthorIds,
            votingIds: []
        }
        const jokeId = await jokesCollection.insertOne(joke);
        await authorsCollection.updateMany({_id: {$in: newAuthorIds}}, {$addToSet: {jokes: jokeId.insertedId}});
        res.status(201).send(joke);
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

//--------------------------------------------------------------------------------------------------
// Start the server
//--------------------------------------------------------------------------------------------------
server.listen(port, () => console.log("app listening on port " + port));
