<script>
    import { getAllAuthors } from "../../axios/author";
    import { createJoke, getAllJokes } from "../../axios/joke";
    import Button from "../ui/button/Button.svelte";
    import humorTypes from "../../humorTypes.json";
    import JokeListEntry from "../jokes/JokeListEntry.svelte";
    import { onMount, afterUpdate } from "svelte";
    import SelectedEntityList from "../selectList/SelectedEntityList.svelte";
    import { filterEntity, isSelected } from "../selectList/utils/utils";
    import {scrollToBottom} from "./utils/utils";

    let authors = [];
    let selectedAuthors = [];
    let jokeEntries = [];
    let jokesListContainer;

    const humorTypeValues = Object.values(humorTypes);

    let joke = {
        jokeTitle: "",
        jokeText: "",
        humorType: "",
        createdDate: new Date().getTime(),
        humorRanking: 0,
        creativityRanking: 0,
        overallRanking: 0,
        authorIds: [],
        votingIds: []
    };

    $: isJokeValid =
        joke.authorIds.length <= 0 ||
        joke.jokeText === "" ||
        joke.humorType === "" ||
        joke.jokeTitle === "";

    (async () => {
        try {
            const authorResult = await getAllAuthors();
            authors = authorResult;
        } catch (error) {
            console.error(`error when retreiving authors: ${error}`);
        }
    })();

    (async () => {
        try {
            const jokeResult = await getAllJokes();
            jokeEntries = jokeResult;
        } catch (error) {
            console.error(`error when retreiving jokes: ${error}`);
        }
    })();

    function setJoke(e) {
        if (e.target.id === "authors") {
            try {
                if (isSelected(selectedAuthors, e)) return;
            } catch (error) {
                console.error(error.message);
            }
            const selectedAuthor = authors.find((author) => {
                return author._id === e.target.value;
            });
            selectedAuthors = [selectedAuthor, ...selectedAuthors];
            joke = { ...joke, authorIds: [...joke.authorIds, e.target.value] };
        } else if (e.target.id === "humorType") {
            joke = { ...joke, humorType: e.target.value };
        }
    }

    function handleSubmit() {
        createJoke(joke)
            .then((joke) => {
                jokeEntries = [...jokeEntries, joke];
            })
            .catch((error) => console.log(error));
    }

    function handleDelete(e) {
        selectedAuthors = filterEntity(e, selectedAuthors);
        joke.authorIds = filterEntity(e, joke.authorIds);
    }

    onMount(() => {
        jokesListContainer.scrollTo(0, jokesListContainer.scrollHeight);
    });

    afterUpdate(() => {
        jokesListContainer.scrollTo(0, jokesListContainer.scrollHeight);
    });
</script>

<main>
    <section class="new-author-container">
        <h1>
            Welcome to <i>Rapid Jokers!</i> To contribute select a humor type for the
            joke and at least one author. <br />
            <a href="#/authors/create-author">Create new Author</a> or
            <button on:click={scrollToBottom}>contribute</button>
        </h1>
    </section>

    <section
        class="jokes-list-container"
        id="jokes-list"
        bind:this={jokesListContainer}
    >
        {#each jokeEntries as joke}
            <JokeListEntry {joke} />
        {/each}
    </section>

    <section class="contribution-container">
        <div class="contribution-form">
            <form on:submit|preventDefault={handleSubmit} id="joke-form">
                <input
                    id="joke-title"
                    type="text"
                    bind:value={joke.jokeTitle}
                    placeholder="Joke title..."
                />
                <textarea
                    id="joke"
                    rows="4"
                    type="text"
                    placeholder="Type your joke..."
                    bind:value={joke.jokeText}
                />
                <Button type="submit" disabled={isJokeValid}>submit</Button>
            </form>
            <div class="select-container">
                {#if selectedAuthors.length > 0}
                    <div class="selected-authors-container">
                        <p>selected authors:</p>
                        <SelectedEntityList
                            entities={selectedAuthors}
                            on:delete-entity={handleDelete}
                        />
                    </div>
                {/if}
                <form>
                    <label for="authors">select authors:</label>
                    <select
                        name="authors"
                        id="authors"
                        on:change={(e) => setJoke(e)}
                    >
                        {#each authors as author}
                            <option value="" selected disabled hidden>Choose here</option>
                            <option value={author._id}>{author.name}</option>
                        {/each}
                    </select>
                </form>

                <form>
                    <label for="humorType">select humor type:</label>
                    <select
                        name="humorType"
                        id="humorType"
                        on:change={(e) => setJoke(e)}
                    >
                        {#each humorTypeValues as ht}
                            <option value="" selected disabled hidden>Choose here</option>
                            <option value={ht}>{ht}</option>
                        {/each}
                    </select>
                </form>
            </div>
        </div>
    </section>
</main>

<style>
    .new-author-container {
        display: flex;
        justify-content: center;
        margin-top: 100px;
        margin-bottom: 20px;
    }
    .new-author-container h1 {
        width: 550px;
        max-width: 550px;
        text-align: center;
        color: var(--black);
        font-size: 35px;
    }

    .new-author-container h1 a,
    .new-author-container h1 button {
        color: var(--light-grey);
    }

    .new-author-container h1 button {
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        cursor: pointer;
        outline: inherit;
    }

    .new-author-container h1 button:hover {
        text-decoration: underline;
        cursor: pointer;
    }

    .contribution-container {
        display: flex;
        justify-content: center;
        margin-top: 10px;
    }

    .select-container {
        position: absolute;
        left: -160px;
        top: -50px;
    }

    .selected-authors-container {
        position: relative;
        top: -200px;
    }

    .selected-authors-container p {
        color: var(--light-grey);
        font-weight: bold;
    }

    .select-container select {
        border: none;
        border-radius: 8px;
        background-color: var(--light-grey);
    }

    .contribution-form > form {
        max-width: 450px;
        display: flex;
        flex-wrap: wrap;
    }

    .contribution-form {
        position: relative;
    }

    .contribution-form label {
        margin-bottom: 10px;
        font-weight: bold;
        color: var(--light-grey);
    }

    .contribution-form textarea,
    #joke-title {
        background-color: var(--purple);
        border: none;
        border-radius: 10px;
        outline: none;
        color: var(--light-grey);
        padding: 10px 20px;
    }

    .contribution-form textarea {
        flex: 1;
        padding: 20px;
        resize: none;
        flex-basis: 100%;
    }

    ::placeholder {
        /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: var(--light-grey);
        opacity: 0.8; /* Firefox */
    }

    :-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: var(--light-grey);
        opacity: 0.8;
    }

    ::-ms-input-placeholder {
        /* Microsoft Edge */
        color: var(--light-grey);
        opacity: 0.8;
    }

    .jokes-list-container {
        max-height: 500px;
        overflow-y: auto;
        max-width: 450px;
        margin: auto;
        padding-right: 5px;
    }

    ::-webkit-scrollbar {
        width: 15px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        border-radius: 10px;
        background-color: var(--grey);
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: var(--light-grey);
        border-radius: 10px;
    }

    @media (max-width: 767px) {
        .select-container {
            top: 220px;
            left: 0px;
        }
        .selected-authors-container {
            top: 195px;
        }
    }
</style>
