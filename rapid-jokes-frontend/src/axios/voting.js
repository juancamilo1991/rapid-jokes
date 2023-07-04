import { client } from "./config/axiosConfig";
import { transformCreatedDate } from "./joke";

async function createVoting(voting) {
    try {
        const votingResult = await client.post("votings", voting)
        return votingResult.data;
    } catch (error) {
        if (error.response) {
            return error.response.status;
        }
        return "SOMETHING_WENT_WRONG";
    }
}

async function getAllVotings() {
    try {
        const votings = await client.get("votings");
        return votings.data;
    } catch (error) {
        if (error.response) {
            return error.response.status;
        }
        return "SOMETHING_WENT_WRONG";
    }
}

async function getVotingById(votingId) {
    try {
        const voting = await client.get(`votings/${votingId}`);
        voting.data = transformCreatedDate(voting.data);
        console.log(voting.data);
        return voting.data;
    } catch (error) {
        if (error.response) {
            return error.response.status;
        }
        return "SOMETHING_WENT_WRONG";
    }
}

export { createVoting, getAllVotings, getVotingById }