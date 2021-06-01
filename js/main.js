const SCENE_MAIN_MENU = 'mainMenu';
const SCENE_GAME_PLAY = 'gamePlay';
const SCENE_GAME_OVER = 'gameOver';

window.addEventListener('load', function () {
    let game = new Game('screen', 800, 400);

    game.setup(function (g) {
        setupKeyboardEvents(g);
        setupAudio(g);
        setupSpaceship(g);
        setupAsteroids(g);
        setupScoreboard(g);
        setupScenes(g);

        g.scope.finalScore = 0;

        // change this to visualize hitboxes
        g.debug = false;
        
    });

    game.run(function (g) {
        g.scope.sceneManager.play(g);
    });
});

function setupKeyboardEvents(g) {
    this.addEventListener('keydown', function (event) {
        let currentScene = g.scope.sceneManager.currentScene;

        switch (event.keyCode) {
            case 38:
                SCENE_GAME_PLAY == currentScene && g.scope.spaceship.moveUp();
                break;

            case 40:
                SCENE_GAME_PLAY == currentScene && g.scope.spaceship.moveDown();
                break;

            case 37:
                SCENE_GAME_PLAY == currentScene && g.scope.spaceship.moveLeft();
                break;

            case 39:
                SCENE_GAME_PLAY == currentScene && g.scope.spaceship.moveRight();
                break;
            
            case 32:
                if (SCENE_MAIN_MENU == currentScene) {
                    setTimeout(function () {
                        g.scope.sceneManager.changeScene(SCENE_GAME_PLAY);
                        g.scope.mainTheme.play();
                    }, 100);
                }

                if (SCENE_GAME_OVER == currentScene) {
                    setTimeout(function () {
                        g.scope.sceneManager.changeScene(SCENE_MAIN_MENU);
                    }, 100);
                }
                break;
        }
    });
}

function setupSpaceship(g) {
    g.scope.spaceship = new Spaceship(360, 173);
    g.scope.spaceship.loadImages(g);
}

function setupAsteroids(g) {
    g.scope.asteroidPool = [];

    for (let i = 0; i < 400; i++) {
        g.scope.asteroidPool.push(new Asteroid(0, 0));
    }

    
    g.scope.asteroidPool[0].loadImages(g);
}

function setupScoreboard(g) {
    g.scope.score = 0;
    g.scope.stage = 1;
}

function setupAudio(g) {
    g.scope.mainTheme = document.getElementById('music_theme');
    g.scope.mainTheme.loop = true;
}

function setupScenes(g) {
    let sceneManager = new SceneManager();

    sceneManager.registerScene(SCENE_MAIN_MENU, function (g) {
        let bigSpaceshipImage = g.getImage(g.scope.spaceship.id + SPACESHIP_UP);

        g.context.drawImage(bigSpaceshipImage, 30, 70, bigSpaceshipImage.width, bigSpaceshipImage.height);

        g.context.fillStyle = '#ffffff';
        g.context.font = '78px arial';
        g.context.fillText('Asteroids', 230, 150);

        g.context.font = '48px arial';
        g.context.fillText('Press SPACE to start', 230, 200);

        resetGameState(g);
    });

    sceneManager.registerScene(SCENE_GAME_PLAY, function (g) {
        g.scope.score += .5;
        g.scope.stage = parseInt(g.scope.score / 100) + 1;
        g.scope.finalScore = g.scope.score;

        let maxAsteroid = g.scope.stage;
        if (maxAsteroid > g.scope.asteroidPool.length) {
            maxAsteroid = g.scope.asteroidPool.length;
        }

        g.scope.spaceship.draw(g);
        
        for (let i = 0; i < maxAsteroid; i++) {
            g.scope.asteroidPool[i].move(g);

            if (collisionDetected(g.scope.asteroidPool[i], g.scope.spaceship)) {
                setTimeout(function () {
                    g.scope.sceneManager.changeScene(SCENE_GAME_OVER);
                });
            }

            g.scope.asteroidPool[i].draw(g);
        }

        g.context.fillStyle = '#ffffff';
        g.context.font = '18px arial';
        g.context.fillText('Stage ' + g.scope.stage, 10, 370);
        g.context.fillText('Score: ' + parseInt(g.scope.score), 10, 390);
    });

    sceneManager.registerScene(SCENE_GAME_OVER, function (g) {
        g.context.fillStyle = '#ffffff';
        g.context.font = '78px arial';
        g.context.fillText('GAME OVER', 100, 100);

        g.context.font = '38px arial';
        g.context.fillText('Final Score: ' + parseInt(g.scope.finalScore), 100, 150);

        g.context.font = '38px arial';
        g.context.fillText('Press SPACE to go to main menu', 100, 200);

        resetGameState(g);
    });

    sceneManager.changeScene(SCENE_MAIN_MENU);

    g.scope.sceneManager = sceneManager;
}

function collisionDetected(asteroid, spaceship) {
    return asteroid.enabled
        && asteroid.hitbox.sx < spaceship.hitbox.dx
        && asteroid.hitbox.dx > spaceship.hitbox.sx
        && asteroid.hitbox.sy < spaceship.hitbox.dy
        && asteroid.hitbox.dy > spaceship.hitbox.sy;
}

function resetGameState(g) {
    for (let i = 0; i < g.scope.asteroidPool.length; i++) {
        g.scope.asteroidPool[i].enabled = false;
    }

    g.scope.spaceship.x = 360;
    g.scope.spaceship.y = 173;
    g.scope.spaceship.direction = SPACESHIP_UP;
    g.scope.score = 0;
    g.scope.mainTheme.pause();
}
