<script>
    import {scale} from "svelte/transition";
    export let joke;
</script>

<main in:scale="{{duration: 500}}" class="container">
    <a class="joke-title" href="#/jokes/{joke._id}">{joke.jokeTitle}</a>
    <div class="joke-text">
        {joke.jokeText}
    </div>
    <div class="joke-entry-footer">
        <div class="joke-humorRanking">
            humor ranking: {joke.humorRanking}
        </div>
        <div class="created-date">
            created: {joke.createdDate}
        </div>
    </div>
</main>

<style>
    .container {
        display: flex;
        flex-direction: column;
        max-width: 450px;
        align-items: flex-start;
        margin: 10px auto;
        padding: 20px;
        background-color: var(--blue);
        border-radius: 15px;
        box-sizing: border-box;
    }
    .joke-title {
        font-size: 15px;
        color: var(--light-grey);
        text-decoration: none;
        padding: 8px;
        font-weight: bold;
        background-color: var(--red);
        border-radius: 20px;
        transition: all 0.2s ease-in-out;
    }

    .joke-title:hover {
        background-color: var(--light-grey);
        color: var(--red);
    } 

    .joke-text {
        color: var(--light-grey);
        margin: 20px 0px;
        width: 300px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .joke-humorRanking,
    .created-date {
        background-color: var(--purple);
        padding: 8px;
        border-radius: 20px;
        color: var(--light-grey);
        font-style: italic;
    }

    .joke-humorRanking {
        margin-right: 10px;
    }

    .joke-entry-footer {
        display: flex;
    }
</style>
