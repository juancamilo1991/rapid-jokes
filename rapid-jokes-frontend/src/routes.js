import Home from "./pages/Home.svelte";

import Jokes from "./pages/joke/Jokes.svelte";
import JokeDetails from "./pages/joke/JokeDetails.svelte";
import AuthorsJokes from "./pages/joke/AuthorsJokes.svelte";

import NotFound from "./pages/NotFound.svelte";

import CreateAuthor from "./pages/author/CreateAuthor.svelte";
import AuthorDetails from "./pages/author/AuthorDetails.svelte";
import Authors from "./pages/author/Authors.svelte";
import AuthorsVotings from "./pages/author/AuthorsVotings.svelte";

import CreateVoting from "./pages/votings/CreateVoting.svelte";
import AllVotings from "./pages/votings/AllVotings.svelte";
import VotingDetails from "./pages/votings/VotingDetails.svelte";
import JokeVotings from "./pages/votings/JokeVotings.svelte";

export default {
    // Exact path
    '/': Home,
    '/home': Home,
	// authors
	'/authors': Authors,
	'/authors/create-author': CreateAuthor,
	'/authors/:id': AuthorDetails,
	'/authors/:id/jokes-list': AuthorsJokes,
	'/authors/:id/votings': AuthorsVotings,

	// jokes
	'/jokes': Jokes,
	'/jokes/:id': JokeDetails,
	'/jokes/:id/votings': JokeVotings,

	// votings
	'/votings': AllVotings,
	'/votings/:id': VotingDetails,
	'/votings/create-voting/:id': CreateVoting,
    // Catch-all
    '*': NotFound
}