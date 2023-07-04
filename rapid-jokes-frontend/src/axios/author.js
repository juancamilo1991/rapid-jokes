import { client } from "./config/axiosConfig";
import { transformCreatedDate } from "./joke";


async function getAllAuthors() {
    try {
        const authors = await client.get("authors");
        return authors.data;
    } catch (error) {
        if (error.response) {
            return error.response.status;
        }
        return "SOMETHING_WENT_WRONG";
    }
}

async function getAuthorById(authorId) {
    let authorResult;
    let jokeResult;
    let votingsResult;
    let theVotingResult;
    try {
        const result = await client.get(`authors/${authorId}`);
        console.log(result.data);
        if (result.data["jokeResult"].length === 0) {
            jokeResult = null;
        }
        else {
            console.log(result.data["jokeResult"][0]);
            jokeResult = transformCreatedDate(result.data["jokeResult"][0]);
        }
        authorResult = result.data["authorResult"];
        votingsResult = result.data["votingsResult"];
        theVotingResult = votingsResult.map(voting => {
            voting = transformCreatedDate(voting);
            return voting;
        })
        return {authorResult, jokeResult, theVotingResult};
      
    } catch (error) {
        if (error.response) {
            return error.response.status;
        }
        return "SOMETHING_WENT_WRONG";
    }
}

async function createNewAuthor(author) {
    try {
        const response = await client.post("authors", author);
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.status;
        }
        return "SOMETHING_WENT_WRONG";
    }
}



export { getAllAuthors, createNewAuthor, getAuthorById };