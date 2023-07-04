<script>
    import SelectedEntityList from "../selectList/SelectedEntityList.svelte";
    import humorTypes from "../../humorTypes.json";
    import { filterEntity, isSelected } from "../selectList/utils/utils";
    import Button from "../ui/button/Button.svelte";
    import { getAllAuthors, createNewAuthor } from "../../axios/author";
    import SuccessCard from "../ui/card/SuccessCard.svelte";

    let authors;
    let selectedHumors = [];
    let enterdName = false;
    let created = false;

    const humorTypeValues = Object.values(humorTypes);

    let author = {
        name: "",
        age: null,
        humorPreferences: [],
        jokes: [],
        votings: []
    };

    (async () => {
        try {
            const authorResult = await getAllAuthors();
            authors = authorResult;
        } catch (error) {
            console.error(`error when retreiving authors: ${error}`);
        }
    })();

    $: isNameTaken = enterdName;
    $: isDisabled = author.name === "" || author.age === null || enterdName;
    $: isCreated = created;

    function setHumorType(e) {
        try {
            if (isSelected(selectedHumors, e)) return;
        } catch (error) {
            console.error(error.message);
        }
        const selectedHumor = humorTypeValues.find((humor) => {
            return humor === e.target.value;
        });
        selectedHumors = [selectedHumor, ...selectedHumors];
        author = {
            ...author,
            humorPreferences: [...author.humorPreferences, e.target.value],
        };
    }

    function createAuthor() {
        createNewAuthor(author)
            .then((response) => {
                author = {
                    name: "",
                    age: null,
                    humorPreferences: [],
                    jokes: []
                };
                selectedHumors = [];
                enterdName = false;
                created = !created;
            })
            .catch((error) => {
                console.error(`Error when posting new Author: ${error}`);
            });
    }

    function handleDelete(e) {
        selectedHumors = filterEntity(e, selectedHumors);
        author.humorPreferences = filterEntity(e, author.humorPreferences);
    }

    function checkName(e) {
        enterdName = authors.some((author) => {
            return author.name === e.target.value;
        });
    }

    function onClose() {
        return (created = !created);
    }
</script>

<main>
    <div class="container">
        <h1>New Author</h1>
        <h2>Please enter a name and your age</h2>
        <form on:submit|preventDefault={createAuthor}>
            <label style="color: var(--purple);" for="name">Name:</label>
            <input
                id="name"
                name="name"
                bind:value={author.name}
                on:input={checkName}
                type="text"
            /> <br />
            {#if isNameTaken}
                <span>this name is already taken!</span>
            {/if}
            <label style="color: var(--purple);" for="age">Age:</label>
            <input
                id="age"
                name="age"
                bind:value={author.age}
                type="number"
                max="99"
            />

            <div class="humor-container">
                <label for="humorType">humor type preferences:</label>
                <select
                    name="humorType"
                    id="humorType"
                    on:change={(e) => setHumorType(e)}
                >
                    {#each humorTypeValues as ht}
                        <option value="" selected disabled hidden
                            >Choose here</option
                        >
                        <option value={ht}>{ht}</option>
                    {/each}
                </select>
            </div>

            <div class="successContainer">
                <Button type="submit" disabled={isDisabled}>Submit</Button>
                {#if isCreated}
                    <div class="successCard">
                        <SuccessCard
                            on:close-card={onClose}
                            text="Author successfully created!"
                        />
                    </div>
                {/if}
            </div>
        </form>

        <div class="selected-humors">
            {#if selectedHumors.length > 0}
                <div class="selected-authors-container">
                    <p>selected humor preferences:</p>
                    <SelectedEntityList
                        entities={selectedHumors}
                        on:delete-entity={handleDelete}
                    />
                </div>
            {/if}
        </div>
    </div>
</main>

<style>
    .container {
        display: grid;
        place-items: center;
        position: relative;
    }

    h1 {
        text-decoration: underline;
        text-underline-offset: 5px;
    }

    h1,
    h2 {
        color: var(--light-grey);
    }

    h2 {
        margin-bottom: 50px;
    }

    span {
        color: var(--error);
    }

    .selected-authors-container p {
        color: var(--light-grey);
        font-weight: bold;
    }

    .humor-container {
        margin-bottom: 20px;
    }

    label {
        font-weight: bold;
        color: var(--light-grey);
        margin-top: 20px;
        margin-bottom: 10px;
    }

    .selected-humors {
        position: absolute;
        right: 300px;
        top: 300px;
    }

    input {
        background: none;
        outline: 0;
        border-width: 0 0 2px;
        border-color: var(--purple);
        color: var(--light-grey);
    }

    select {
        border: none;
        border-radius: 8px;
        background-color: var(--light-grey);
    }

    .successContainer {
        position: relative;
    }

    .successCard {
        position: absolute;
        left: 200px;
        bottom: 0px;
    }
</style>
