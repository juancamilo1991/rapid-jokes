<script>
</script>

<nav class="container">
    <div class="navbar">
        <ul>
            <li class="nav-item">
                <a class="nav-link" href="#/home">
                    <img src="./images/joker.png" class="home-icon" alt="joker" />
                </a>
            </li>
            |
            <li class="nav-item">
                <a class="nav-link" href="#/authors">Authors</a>
            </li>
            |
            <li class="nav-item">
                <a class="nav-link" href="#/jokes">Jokes</a>
            </li>
            |
            <li class="nav-item">
                <a class="nav-link" href="#/votings"> Votings </a>
            </li>
        </ul>
    </div>
</nav>

<style>
    .container {
        padding: 15px 0px;
        background-color: var(--purple);
        border-radius: 15px;
    }

    .container .navbar {
        display: flex;
        justify-content: center;
    }

    .container .navbar ul {
        width: 400px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0px 20px;
        margin: 0;
    }

    .container .navbar li {
        list-style: none;
        display: inline-block;
    }

    .container .navbar a {
        color: var(--red);
    }

    .container .navbar a:hover {
        text-decoration: none;
        color: white;
    }

    .home-icon {
        width: 80px;
        height: 80px;
    }

    @media (max-width: 400px) {
        .home-icon {
            width: 50px;
            height: 50px;
        }
    }
</style>
