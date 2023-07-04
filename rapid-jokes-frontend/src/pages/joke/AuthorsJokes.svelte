<script>
    import AllEntitiesList from "../../components/AllEntitiesList.svelte";
    import {getJokesByAuthor} from "../../axios/joke";
    import { push } from "svelte-spa-router";
    import Navbar from "../../components/navigation/Navbar.svelte";
    import NoEntries from "../NoEntries.svelte";
    
    export let params;

    let jokes = [];
    let title = "";
    let authorName= "";

    (async () => {
        try {
            const result = await getJokesByAuthor(params.id);
            if (result === 404) {
                return push("/not-found");
            }
            if (result === 500) {
                return push("/server-error");
            }
            const {author, transformedJokes} = result;
            title = `${author.name}'s Jokes`;
            authorName = author.name;
            jokes = transformedJokes;
        } catch (error) {
            console.error(`error when retreiving jokes: ${error}`);
        }
    })();
</script>

<Navbar />
<main>
    {#if jokes.length > 0}
        <AllEntitiesList
        title={title}
        entity={jokes}
        firstColumn="Title"
        secondColumn="Created"
        thirdColumn="Humor Ranking"
        fourthColumn="Creativity Ranking"
        jokes
        />
        {:else}
        <NoEntries entity={`Jokes for ${authorName}`} />
    {/if}

</main>