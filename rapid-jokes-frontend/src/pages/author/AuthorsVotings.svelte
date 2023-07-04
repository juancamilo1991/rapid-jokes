<script>
    import {getAuthorById} from "../../axios/author";
    import AllEntitiesList from "../../components/AllEntitiesList.svelte";
    import Navbar from "../../components/navigation/Navbar.svelte";
    import NoEntries from "../NoEntries.svelte";
    export let params;

    let author = null;
    let votings = [];
    let title = "";
    let authorName = "";

    (async () => {
        try {
            console.log(params.id);
            const { jokeResult, authorResult, theVotingResult } = await getAuthorById(params.id);
            author = authorResult;
            votings = theVotingResult;
            title = `${author.name}'s Votings'`;
            authorName = author.name;
        } catch (error) {
            console.error(`error when retreiving author: ${error}`);
        }
    })();

</script>

<Navbar />
<main>
    {#if votings.length > 0}
        <AllEntitiesList
        entity={votings}
        title={title}
        firstColumn="Created"
        secondColumn="For Joke"
        thirdColumn="Humor rated"
        fourthColumn="Creativity rated"
        fifthColumn="Voting Details"
        authorsVotings
        />
        {:else}
        <NoEntries entity={`Votings from ${authorName}`} />
    {/if}
</main>