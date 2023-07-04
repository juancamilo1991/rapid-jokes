<script>
    import Navbar from "../components/navigation/Navbar.svelte";
    export let params;

</script>

<main>
    <Navbar />
    <div class="container">
        {#if params.wild === "server-error"}
            <h1>Oops, something went wrong</h1>
            <h2>Error Code: 500</h2>
            <img src="./images/sad-joker.svg" alt="sad-joker">
        {:else}
        <h1>Sorry, the punch line you were looking for was not found</h1>
        <h2>Error Code: 404</h2>
        <img src="./images/sad-joker.svg" alt="sad-joker">
        {/if}
    </div>
</main>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .container h1 {
        color: var(--light-grey);
        font-size: 50px;
        max-width: 600px;
        text-align: center;
    }

    .container h2 {
        margin-top: 0;
        font-style: italic;
        color: var(--error);
    }

    .container img {
        height: 200px;
        width: 200px;
    }

</style>