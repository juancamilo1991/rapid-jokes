<script>
    import AllEntitiesList from "../../components/AllEntitiesList.svelte";
    import {getAllJokes} from "../../axios/joke";
    import Navbar from "../../components/navigation/Navbar.svelte";
    import NoEntries from "../NoEntries.svelte";


    let jokes = [];

    (async () => {
        try {
            const jokeResult = await getAllJokes();
            jokes = jokeResult;
        } catch (error) {
            console.error(`error when retreiving jokes: ${error}`);
        }
    })();

// depending wether it is authors, jokes or votings
// if its authors:
// -> three columns, 

</script>

<Navbar />
<main>
    {#if jokes.length > 0}
        <AllEntitiesList
        entity={jokes}
        title="All Jokes"
        firstColumn="Title"
        secondColumn="Created"
        thirdColumn="Humor Ranking"
        fourthColumn="Creativity Ranking"
        jokes
        />
        {:else}
        <NoEntries entity="Jokes" />
    {/if}
</main>