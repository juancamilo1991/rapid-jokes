<script>

    export let title;
    export let entity;
    export let firstColumn;
    export let secondColumn;
    export let thirdColumn;
    export let fourthColumn;
    export let fifthColumn;
    export let jokes;
    export let authors;
    export let allVotings;
    export let jokesVotings;
    export let authorsVotings;
    
</script>
<main>
    <h1>{title}</h1>
    <div class="container">
        <div class="{fourthColumn !== undefined ? 'entities-container four-columns' : 'entities-container'}">
            <div class="first-column-container">
                <h2>{firstColumn}</h2>

                {#each entity as ent}
                    {#if authors}
                        <a href="#/authors/{ent._id}" class="first-column-value"
                            >{ent.name}</a
                        >
                    {:else if jokes}
                        <a href="#/jokes/{ent._id}" class="first-column-value"
                            >{ent.jokeTitle}</a
                        >
                        {:else if allVotings}
                        <a href="#/jokes/{ent.jokeId._id}" class="first-column-value"
                            >{ent.jokeId.jokeTitle}</a
                        >
                        {:else if jokesVotings}
                        <a href="#/authors/{ent.votingAuthor._id}" class="first-column-value"
                            >{ent.votingAuthor.name}</a
                        >
                        {:else if authorsVotings}
                        <span class="second-column-value">{ent.createdDate}</span>
                    {/if}
                {/each}
            </div>
            <div class="second-column-container">
                <h2>{secondColumn}</h2>

                {#each entity as ent}
                    {#if authors}
                        <span class="second-column-value">{ent.age}</span>
                    {:else if jokes}
                        <span class="second-column-value">{ent.createdDate}</span>
                    {:else if allVotings}
                    <a href="#/authors/{ent.votingAuthor._id}" class="first-column-value"
                            >{ent.votingAuthor.name}</a
                        >
                        {:else if jokesVotings}
                        <span class="second-column-value">{ent.humorRate}</span>
                        {:else if authorsVotings}
                        <a href="#/jokes/{ent.jokeId._id}" class="first-column-value"
                            >{ent.jokeId.jokeTitle}</a
                        >
                    {/if}
                {/each}
            </div>
            <div class="third-column-container">
                <h2>{thirdColumn}</h2>

                {#each entity as ent}
                    {#if authors}
                        <a
                            href="#/authors/{ent._id}/jokes-list"
                            class="third-column-value"
                            >open {ent.name}'s jokes list</a
                        >
                    {:else if jokes}
                        <span class="second-column-value">{ent.humorRanking}</span>
                    {:else if allVotings}
                        <span class="second-column-value">{ent.humorRate}</span>
                        {:else if jokesVotings}
                            <span class="second-column-value">{ent.creativityRate}</span>
                        {:else if authorsVotings}
                        <span class="second-column-value">{ent.humorRate}</span>
                    {/if}
                {/each}
            </div>
            {#if jokes || allVotings || jokesVotings || authorsVotings}
                <div class="fourth-column-container">
                    <h2>{fourthColumn}</h2>
                    
                    {#each entity as ent}
                    {#if allVotings || authorsVotings}
                        <span class="second-column-value">{ent.creativityRate}</span>
                        {:else if jokesVotings}
                        <a href="#/votings/{ent._id}" class="first-column-value"
                        >Go to Details</a>
                        {:else}
                        <span class="second-column-value">{ent.creativityRanking}</span>
                    {/if}
                    {/each}
                </div>
            {/if}
            {#if allVotings || authorsVotings}
                <div class="fifth-column-container">
                    <h2>{fifthColumn}</h2>
                    {#each entity as ent}
                    <a href="#/votings/{ent._id}" class="first-column-value"
                    >Go to details</a
                >
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</main>

<style>
    h1,
    h2 {
        color: var(--light-grey);
        text-decoration: underline;
        text-underline-offset: 5px;
    }

    h1 {
        display: flex;
        margin-top: 100px;
    }

    h2 {
        display: grid;
        place-items: center;
    }

    .container, h1 {
        display: flex;
        justify-content: center;
    }

    .first-column-container {
        display: flex;
        flex-direction: column;
    }

    .entities-container {
        display: flex;
        justify-content: space-between;
        max-width: 600px;
        flex-basis: 600px;
    }

    .four-columns {
        max-width: 850px;
        flex-basis: 850px;
    }

    .second-column-value {
        color: var(--light-grey);
    }

    .first-column-value,
    .second-column-value,
    .third-column-value {
        padding: 8px;
        display: grid;
        place-items: center;
        margin-bottom: 20px;
    }

    .third-column-value,
    .first-column-value {
        background-color: var(--purple);
        text-decoration: none;
        color: var(--light-grey);
        border-radius: 15px;
        transition: all 0.2s ease-in-out;
    }

    .first-column-value:hover,
    .third-column-value:hover {
        cursor: pointer;
        background-color: var(--light-grey);
        color: var(--red);
    }

    
     
</style>
