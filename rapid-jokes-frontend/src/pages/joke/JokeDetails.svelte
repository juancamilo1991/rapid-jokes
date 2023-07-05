<script>
    import Navbar from "../../components/navigation/Navbar.svelte";
    import { getJokeById } from "../../axios/joke";
    import { push } from "svelte-spa-router";

    export let params;
    let authors = null;
    let joke = null;

    (async () => {
        try {
            const result = await getJokeById(params.id);
            if (result === 404) {
                return push("/not-found");
            }
            if (result === 500) {
                return push("/server-error");
            } else {
                const { jokeResult, authorResult, votingResult } = result;
                authors = authorResult;
                joke = jokeResult;
            }
        } catch (error) {
            console.error(`error when retreiving joke: ${error}`);
        }
    })();
</script>

<main>
    <Navbar />
    {#if joke !== null}
        <div class="container">
            <h1>{joke.jokeTitle}</h1>
            <div class="overall-ranking-container">
                <h2>overall ranking:</h2>
                <span>{joke.overallRanking}</span>
            </div>
            <div class="joke-text-container">
                <h2>joke:</h2>
                <span>{joke.jokeText}</span>
            </div>
            <div class="humor-ranking-container">
                <h2>humor ranking:</h2>
                <span>{joke.humorRanking}</span>
            </div>
            <div class="creativity-ranking-container">
                <h2>cretivity ranking:</h2>
                <span>{joke.creativityRanking}</span>
            </div>
            <div class="humor-type-container">
                <h2>humor type:</h2>
                <span>{joke.humorType}</span>
            </div>
            <div class="created-container">
                <h2>created:</h2>
                <span>{joke.createdDate}</span>
            </div>
            <div class="authors-container">
                <h2>authors:</h2>
                <div class="authors">
                    {#if authors.length > 0}
                        {#each authors as author, i}
                            {#if i === authors.length - 1}
                                <span>{author.name}</span>
                            {:else}
                                <span>{author.name},</span>
                            {/if}
                        {/each}
                    {/if}
                </div>
            </div>
            <div class="votings-container">
                <h2>votings:</h2>
                <a href="#/jokes/{joke._id}/votings" class="jokes-votings"
                    >all Votings for this Joke</a
                >
                <a
                    href="#/votings/create-voting/{joke._id}"
                    class="jokes-votings">create voting for this joke</a
                >
            </div>
        </div>
    {/if}
</main>

<style>
    h1 {
        color: var(--light-grey);
        text-decoration: underline;
        text-underline-offset: 5px;
    }

    h2 {
        color: var(--light-grey);
        margin-bottom: 5px;
    }

    .container {
        margin-left: 50px;
        margin-top: 50px;
    }

    .overall-ranking-container,
    .joke-text-container,
    .humor-ranking-container,
    .creativity-ranking-container,
    .humor-type-container,
    .created-container,
    .authors-container,
    .votings-container {
        display: flex;
        align-items: center;
    }

    .joke-text-container {
        flex-direction: column;
        align-items: flex-start;
    }

    .overall-ranking-container span,
    .joke-text-container span,
    .humor-ranking-container span,
    .creativity-ranking-container span,
    .humor-type-container span,
    .created-container span,
    .authors {
        display: flex;
        margin-top: 20px;
        margin-left: 20px;
        font-style: italic;
        color: var(--light-grey);
        max-width: 800px;
    }

    .authors-container span {
        margin-right: 10px;
    }

    .jokes-votings {
        display: inline-block;
        font-style: italic;
        text-decoration: underline;
        color: var(--purple);
        margin-left: 20px;
        font-size: 25px;
        margin-top: 10px;
        font-weight: bolder;
    }

    .jokes-votings:hover {
        color: var(--light-grey);
    }

    main {
        padding-bottom: 100px;
    }
</style>
