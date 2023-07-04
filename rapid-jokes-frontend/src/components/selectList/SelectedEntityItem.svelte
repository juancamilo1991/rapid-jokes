<script>
    import { createEventDispatcher } from "svelte";
    import { scale } from "svelte/transition";

    export let entity;

    const dispatch = createEventDispatcher();

    function handleDeleteEntityItem(entityId) {
        dispatch("delete-entity", entityId);
    }
</script>

<main class="container" transition:scale={{ duration: 200 }}>
    {#if typeof entity === "object"}
        <span>{entity.name}</span>
        <button
            class="delete-entity"
            on:click={() => handleDeleteEntityItem(entity._id)}>x</button
        >
    {:else}
        <span>{entity}</span>
        <button
            class="delete-entity"
            on:click={() => handleDeleteEntityItem(entity)}>x</button
        >
    {/if}
</main>

<style>
    .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--light-grey);
        padding: 3px 5px;
        min-width: 130px;
        border-radius: 10px;
        margin-bottom: 5px;
    }

    .delete-entity {
        background-color: var(--purple);
        color: var(--yellow);
        border: none;
        border-radius: 5px;
        margin: 0;
        display: flex;
        align-items: center;
        height: 25px;
        padding-top: 2px;
    }

    .delete-entity:hover {
        cursor: pointer;
        background-color: var(--black);
        transition: all 0.3s ease-in-out;
    }
</style>
