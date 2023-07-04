<script>
    export let disabled;
    export let type;
</script>

<button {type} {disabled}>
    <slot />
</button>

<style>
    button {
        border: none;
        border-radius: 8px;
        width: 100px;
        height: 40px;
        cursor: pointer;
        background-color: var(--light-grey);
        color: var(--black);
    }

    button:hover {
        opacity: 0.9;
    }
    button:disabled {
        background-color: var(--blue);
        color: var(--light-grey);
        cursor: auto;
    }
    button:disabled:hover {
        transform: scale(1);
        opacity: 1;
    }
</style>
