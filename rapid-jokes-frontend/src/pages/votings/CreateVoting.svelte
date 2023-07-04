<script>
    import Navbar from "../../components/navigation/Navbar.svelte";
    import { getJokeById } from "../../axios/joke";
    import { getAllAuthors } from "../../axios/author";
    import { createVoting } from "../../axios/voting";
    import SuccessCard from "../../components/ui/card/SuccessCard.svelte";
    import Button from "../../components/ui/button/Button.svelte";

    export let params;

    let authors = [];
    let joke = null;
    let ratings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let created = false;

    $: isDisabled =
        voting.humorRate === 0 ||
        voting.creativityRate === 0 ||
        voting.votingAuthor === null ||
        voting.jokeId === null;

    $: isCreated = created;

    let voting = {
        createdDate: new Date().getTime(),
        humorRate: 0,
        creativityRate: 0,
        comment: "",
        votingAuthor: null,
        jokeId: null,
    };

    (async () => {
        try {
            const { jokeResult, authorResult } = await getJokeById(params.id);
            joke = jokeResult;
            voting.jokeId = joke._id;
        } catch (error) {
            console.error(`error when retreiving joke: ${error}`);
        }
    })();

    (async () => {
        try {
            const authorResult = await getAllAuthors();
            authors = authorResult;
        } catch (error) {
            console.error(`error when retreiving authors: ${error}`);
        }
    })();

    function setRating(e) {
        let value = e.target.value;
        if (e.target.id !== "votingAuthor") {
            value = parseInt(value);
        }
        voting = { ...voting, [e.target.id]: value };
    }

    function handleSubmit() {
        createVoting(voting).then((response) => {
            voting = {
                createdDate: new Date().getTime(),
                humorRate: 0,
                creativityRate: 0,
                comment: "",
                votingAuthor: null,
                jokeId: null,
            };
            created = !created;
        }).catch(error => {
            console.error(`Error when posting new Voting: ${error}`);
        });
    }

    function onClose() {
        return (created = !created);
    }
</script>

<main>
    <Navbar />
    {#if joke !== null}
        <div class="container">
            <h1>New Voting for {joke.jokeTitle}</h1>
            <form on:submit|preventDefault={handleSubmit}>
                <div class="humor-rating">
                    <h2>humor rating:</h2>
                    <select
                        name="humorRate"
                        id="humorRate"
                        on:change={(e) => setRating(e)}
                    >
                        {#each ratings as rating}
                            <option value="" selected disabled hidden
                                >Choose here</option
                            >
                            <option value={rating}>{rating}</option>
                        {/each}
                    </select>
                </div>
                <div class="creativity-rating">
                    <h2>creativity rating:</h2>
                    <select
                        name="creativityRate"
                        id="creativityRate"
                        on:change={(e) => setRating(e)}
                    >
                        {#each ratings as rating}
                            <option value="" selected disabled hidden
                                >Choose here</option
                            >
                            <option value={rating}>{rating}</option>
                        {/each}
                    </select>
                </div>
                <div class="comment-container">
                    <h2>comment:</h2>
                    <input
                        id="comment"
                        name="comment"
                        bind:value={voting.comment}
                        type="text"
                    />
                </div>
                <div class="author-container">
                    <h2>who is voting:</h2>
                    <select
                        name="votingAuthor"
                        id="votingAuthor"
                        on:change={(e) => setRating(e)}
                    >
                        {#each authors as author}
                            <option value="" selected disabled hidden
                                >Choose here</option
                            >
                            <option value={author._id}>{author.name}</option>
                        {/each}
                    </select>
                </div>
                <div class="successContainer">
                    <Button type="submit" disabled={isDisabled}>Submit</Button>
                    {#if isCreated}
                        <div class="successCard">
                            <SuccessCard
                                on:close-card={onClose}
                                text="Voting successfully added!"
                            />
                        </div>
                    {/if}
                </div>
            </form>
        </div>
    {/if}
</main>

<style>
    .container {
        margin-left: 50px;
        margin-top: 50px;
    }

    h1 {
        color: var(--light-grey);
        text-decoration: underline;
        text-underline-offset: 5px;
    }

    h2 {
        color: var(--light-grey);
    }

    .humor-rating,
    .creativity-rating,
    .comment-container,
    .author-container {
        display: flex;
        align-items: center;
    }

    select {
        border: none;
        border-radius: 8px;
        background-color: var(--light-grey);
    }

    #humorRate,
    #creativityRate,
    #votingAuthor {
        margin-left: 20px;
        margin-top: 10px;
    }

    input {
        background: none;
        outline: 0;
        border-width: 0 0 2px;
        border-color: var(--light-grey);
        color: var(--light-grey);
        margin-left: 20px;
        width: 50%;
    }

    .successCard {
        max-width: 300px;
    }
</style>
