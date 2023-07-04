<script>
    import SelectedEntityItem from "./SelectedEntityItem.svelte";
    export let entities;
</script>

<main class="container">
    {#each entities as entity}
        <SelectedEntityItem entity={entity} on:delete-entity />
    {/each}
</main>

<style>
    .container {
        display: flex;
        flex-direction: column;
        position: absolute;
    }
</style>