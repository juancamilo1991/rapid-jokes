<script>
    import { getAuthorById } from "../../axios/author";
    import Navbar from "../../components/navigation/Navbar.svelte";
    import { push } from "svelte-spa-router";

    export let params;
    let author = null;
    let joke = null;
    let result;

    (async () => {
        try {
            result = await getAuthorById(params.id);
            console.log(result);
            if (result === 404) {
                return push("/not-found");
            }
            if (result === 500) {
                return push("/server-error");
            } else {
                const { authorResult, jokeResult, votingsResult } = result;
                author = authorResult;
                joke = jokeResult;
            }
        } catch (error) {
            console.error(`error when retreiving author: ${error}`);
        }
    })();
</script>

<main>
    <Navbar />
    {#if author !== null}
        <div class="container">
            <h1>{author.name}</h1>
            <div class="humor-preferences-container">
                <h2>likes:</h2>
                <div class="humor-preferences">
                    {#if author.humorPreferences.length > 0}
                        {#each author.humorPreferences as hp, i}
                            {#if i === author.humorPreferences.length - 1}
                                <span>{hp}</span>
                            {:else}
                                <span>{hp},</span>
                            {/if}
                        {/each}
                    {/if}
                </div>
            </div>
            <div class="age-container">
                <h2>age:</h2>
                <span>{author.age}</span>
            </div>
            <div class="first-contribution-container">
                <h2>first contribution:</h2>
                {#if joke !== null}
                    <span>{joke.createdDate}</span>
                {:else}
                    <span>No contributions yet</span>
                {/if}
            </div>
            <a href="#/authors/{author._id}/jokes-list" class="authors-jokes"
                >View all of {author.name}'s Jokes</a
            ><br />
            <a href="#/authors/{author._id}/votings" class="authors-jokes"
                >View all of {author.name}'s Votings</a
            >
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
    }

    .container {
        margin-left: 50px;
        margin-top: 50px;
    }

    .humor-preferences,
    .age-container span,
    .first-contribution-container span {
        display: flex;
        margin-top: 5px;
        margin-left: 20px;
        font-style: italic;
        color: var(--light-grey);
    }

    .humor-preferences-container,
    .age-container,
    .first-contribution-container {
        display: flex;
        align-items: center;
    }

    .humor-preferences span {
        margin-right: 10px;
    }

    .authors-jokes {
        display: inline-block;
        font-style: italic;
        text-decoration: underline;
        color: var(--purple);
        font-size: 25px;
        margin-top: 10px;
        font-weight: bolder;
    }

    .authors-jokes:hover {
        color: var(--light-grey);
    }
</style>
