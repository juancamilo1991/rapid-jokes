<script>
    import AllEntitiesList from "../../components/AllEntitiesList.svelte";
    import {getAllAuthors} from "../../axios/author";
    import Navbar from "../../components/navigation/Navbar.svelte";
    import NoEntries from "../NoEntries.svelte";


    let authors = [];

    (async () => {
        try {
            const authorResult = await getAllAuthors();
            authors = authorResult;
        } catch (error) {
            console.error(`error when retreiving authors: ${error}`);
        }
    })();

</script>

<Navbar />
<main>
    {#if authors.length > 0}
        <AllEntitiesList
        entity={authors}
        title="All Authors"
        firstColumn="Name"
        secondColumn="Age"
        thirdColumn="Jokes"
        authors
        />
        {:else}
        <NoEntries entity="authors" />
    {/if}
</main>

<style>
   
</style>