<script>
    import SelectedEntityList from "./SelectedEntityList.svelte";
    export let selectedEntity;
    export let entityName;
</script>

{#if Array.isArray(selectedEntity) && selectedEntity.length > 0}
    <div class="selected-authors-container">
        <p>selected {entityName}:</p>
        <SelectedEntityList
            entities={selectedEntity}
            on:delete-entity
        />
    </div>
{/if}

<style>
    .selected-authors-container {
        position: relative;
        top: -200px;
    }

    .selected-authors-container p {
        color: var(--light-grey);
        font-weight: bold;
    }

    @media (max-width: 767px) {
        .selected-authors-container {
            top: 195px;
        }
    }
</style>
