<script>
    import Navbar from "../../components/navigation/Navbar.svelte";
    import {getVotingById} from "../../axios/voting";
    import { push } from "svelte-spa-router";

    export let params;

    let voting = null;

    (async () => {
        try {
            const resultVoting = await getVotingById(params.id);
            if (resultVoting === 404) {
                return push("/not-found");
            }
            if (resultVoting === 500) {
                return push("/server-error");
            }
            voting = resultVoting;
        } catch (error) {
            console.error(`error when retreiving author: ${error}`);
            return push("/server-error");
        }
    })();

</script>

<main>
    <Navbar />
    {#if voting !== null}
    <div class="container">
        <div class="created-container">
            <h2>Created:</h2>
            <span>{voting.createdDate}</span>
        </div>
        <div class="author-container">
            <h2>Voter:</h2>
            <a href="#/authors/{voting.votingAuthor._id}" class="votings-author">{voting.votingAuthor.name}</a>
        </div>
        <div class="joke-container">
            <h2>Joke:</h2>
            <a href="#/jokes/{voting.jokeId._id}" class="votings-joke">{voting.jokeId.jokeTitle}</a>
        </div>
        <div class="comment-container">
            <h2>Comment:</h2>
            <span>{voting.comment}</span>
        </div>
        <div class="humor-container">
            <h2>Humor rated:</h2>
            <span>{voting.humorRate}</span>
        </div>
        <div class="creativity-container">
            <h2>Creativity Rated:</h2>
            <span>{voting.creativityRate}</span>
        </div>
    </div>
    {/if}
</main>

<style>
    .container {
        margin-left: 50px;
        margin-top: 50px;
    }

    h2 {
        color: var(--light-grey);
    }

    .created-container,
    .author-container,
    .joke-container, 
    .comment-container,
    .humor-container,
    .creativity-container {
        display: flex;
        align-items: center;
    }

    .created-container span,
    .comment-container span,
    .humor-container span,
    .creativity-container span {
        display: flex;
        margin-left: 20px;
        margin-top: 5px;
        font-style: italic;
        color: var(--light-grey);
    }

    .votings-author, .votings-joke {
        display: inline-block;
        font-style: italic;
        text-decoration: underline;
        color: var(--purple);
        margin-left: 20px;
        margin-bottom: 5px;
        font-size: 25px;
        font-weight: bolder;
    }

    .votings-author:hover, .votings-joke:hover {
        color: var(--light-grey);
    }
</style>