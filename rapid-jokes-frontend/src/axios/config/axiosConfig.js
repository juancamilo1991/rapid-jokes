import axios from "axios";

// axios instance with default configuration
const client = axios.create({
    baseURL: "http://localhost:3001/api/",
    headers: {"Content-Type": "application/json"}
})

export {client};