import axios from "axios";
import { client } from "./config/axiosConfig";


function prependZeroToDate(date) {
    if (date < 10) {
        date = `0${date}`;
    }
    return date;
}

function transformCreatedDate(entity) {
    const created = entity.createdDate;
                if (created !== null && typeof created === 'number') {
                    const date = new Date(created);
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    const year = date.getFullYear();
                    month = prependZeroToDate(month);
                    day = prependZeroToDate(day);
                    entity.createdDate = `${day}-${month}-${year}`;
                    return entity;
                }
                throw new Error("Could not get created date");
}

async function createJoke(joke) {
    console.log(joke)
    try {
        const response = await client.post("jokes", joke, {
            transformResponse: axios.defaults.transformResponse.concat(transformCreatedDate)
        });
        console.log(response);
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.status;
        }
        return "SOMETHING_WENT_WRONG";

    }
}

async function getAllJokes() {
    try {
        const jokes = await client.get("jokes");
        const transformedJokes = jokes.data.map(transformCreatedDate);
        return transformedJokes;
    } catch (error) {
        if (error.response) {
            return error.response.status;
        }
        return "SOMETHING_WENT_WRONG";
    }
}

async function getJokeById(jokeId) {
    try {
        const result = await client.get(`jokes/${jokeId}`)
        const jokeResult = transformCreatedDate(result.data["joke"]);
        const authorResult = result.data["authors"];
        const votingResult = result.data["resultVotings"];
        console.log(votingResult);
        console.log(jokeResult)
        return {jokeResult, authorResult, votingResult};
    } catch (error) {
        if (error.response) {
            return error.response.status;
        }
        return "SOMETHING_WENT_WRONG";
    }
}

async function getJokesByAuthor(authorId) {
    try {
        console.log('called')
        const result = await client.get(`jokes/myJokes/${authorId}`)
        console.log(result)
        const {jokes, author} = result.data;
     
        const transformedJokes = jokes.map(transformCreatedDate);
        return {transformedJokes, author};
    } catch (error) {
        if (error.response) {
           return error.response.status;
    }
    return "SOMETHING_WENT_WRONG";
}
}


export { createJoke, getAllJokes, getJokeById, getJokesByAuthor, transformCreatedDate }