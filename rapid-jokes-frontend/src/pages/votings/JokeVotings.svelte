<script>
    import AllEntitiesList from "../../components/AllEntitiesList.svelte";
    import {getJokeById} from "../../axios/joke";
    import Navbar from "../../components/navigation/Navbar.svelte";
    import NoEntries from "../NoEntries.svelte";
    export let params;

    let joke = null;
    let votings = [];
    let title = "";
    let jokeTitle = "";


    (async () => {
        try {
            const { jokeResult, authorResult, votingResult } = await getJokeById(params.id);
            joke = jokeResult;
            votings = votingResult;
            title = `Votings for ${joke.jokeTitle}`;
            jokeTitle = joke.jokeTitle;
        } catch (error) {
            console.error(`error when retreiving joke: ${error}`);
        }
    })();

</script>

<Navbar />
<main>
    {#if votings.length > 0}
        <AllEntitiesList
        entity={votings}
        title={title}
        firstColumn="Voter"
        secondColumn="Humor Rated"
        thirdColumn="Creativity Rated"
        fourthColumn="Go to Details"
        jokesVotings
        />
        {:else}
        <NoEntries entity={`Votings for ${jokeTitle}`} />
    {/if}
</main>