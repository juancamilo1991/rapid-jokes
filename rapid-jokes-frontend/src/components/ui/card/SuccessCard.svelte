<script>
    import { createEventDispatcher } from "svelte";
    export let text;

    const dispatch = createEventDispatcher();

    function handleClose() {
        dispatch("close-card");
    }
</script>

<main>
    <div class="container">
        {text}
        <button on:click={handleClose} class="delete-btn"
            >x</button
        >
    </div>
</main>

<style>
    .container {
        padding: 20px;
        background-color: var(--success);
        border-radius: 15px;
        color: var(--blue);
        position: relative;
        min-width: 200px;
    }

    .delete-btn {
        position: absolute;
        background: none;
        border: none;
        padding: 2px;
        cursor: pointer;
        top: 0;
        right: 5px;
    }
</style>
