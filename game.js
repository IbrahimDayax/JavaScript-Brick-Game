//******************************************
//Author: Ibrahim Dayax    Date: 6/1/19    *
//Title: 404 Error Game                    *
//Github: https://github.com/ibrahimdayax  *
//******************************************

//Style Function

function style(backgroundColor) {
    window.onload = function() {
        let gameScreen = document.getElementById('game-screen');
        gameScreen.style.backgroundColor = backgroundColor;
        gameScreen.style.display = 'block';
        gameScreen.style.margin = 'auto';
        gameScreen.style.border = '1px solid white';
        let allImages = document.getElementsByTagName('img');
        this.document.getElementById('lives').style.color = 'white';
        for (let index = 0; index < allImages.length; index++) {
            allImages[index].style.display = 'none';
        }

    };
};

//GAME Objects

const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 3,
};
const GAME = {

    gamestate: GAMESTATE.MENU,
    lives: 5,

    update: () => {
        if (GAME.lives === 0) GAME.gamestate = GAMESTATE.GAMEOVER;
    },

    start: () => GAME.gamestate = GAMESTATE.RUNNING,

    togglePause: () => {
        if (GAME.gamestate === GAMESTATE.PAUSED) {
            GAME.gamestate = GAMESTATE.RUNNING;
        } else if (GAME.gamestate === GAMESTATE.RUNNING) {
            GAME.gamestate = GAMESTATE.PAUSED;
        }
    }

};

//Ball Constructor function
function Ball(gameWidth, gameHeight) {
    this.image = document.getElementById('ball-img');
    this.size = 20;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.reset = () => {
        this.position = {
            x: 10,
            y: 400
        };
        this.speed = {
            x: 12,
            y: -6
        };
    };
    this.reset();

    this.draw = ctx => ctx.drawImage(this.image, this.position.x, this.position.y, this.size, this.size);

    this.update = deltaTime => {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        //check collision with walls on right or left
        if (this.position.x + this.size > this.gameWidth || this.position.x < 0) {
            this.speed.x = -this.speed.x;
        }
        //check collision on top of the wall
        if (this.position.y < 0) {
            this.speed.y = -this.speed.y;
        }
        // check collision with the bottom of the wall
        if (this.position.y + this.size > this.gameHeight) {
            GAME.lives--;
            this.reset();
        }
        // detect colision with paddle
        if (detectCollision(paddle)) {
            this.speed.y = -this.speed.y;
            this.position.y = paddle.position.y - this.size;
        }
    };

}

//Paddle constructor function
function Paddle(gameWidth, gameHeight, paddleColor) {

    this.width = 150;
    this.height = 20;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;

    this.maxSpeed = 13;
    this.speed = 0;

    this.position = {
        x: gameWidth / 2 - this.width / 2,
        y: gameHeight - this.height - 10
    };

    this.draw = ctx => {
        ctx.fillStyle = paddleColor;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    };

    this.update = deltaTime => {
        // if (!deltaTime) return;

        //Normal user driven mode
        this.position.x += this.speed;


        //Unbeatable AI mode;
        // this.position.x = ball.position.x - this.width / 2;



        if (this.position.x < 0) this.position.x = 0;

        if (this.position.x + this.width > this.gameWidth) this.position.x = this.gameWidth - this.width;

    };

    this.moveLeft = () => {
        this.speed = -this.maxSpeed;
    };

    this.moveRight = () => {
        this.speed = this.maxSpeed;
    };

    this.stop = () => {
        this.speed = 0;
    };
};

//Collision detection function
function detectCollision(gameObject) {

    const bottomOfBall = ball.position.y + ball.size;
    const topOfBall = ball.position.y;

    const topOfGameObject = gameObject.position.y;
    const leftSideOfGameObject = gameObject.position.x;
    const rightSideOfGameObject = gameObject.position.x + gameObject.width;
    const bottomOfGameObject = gameObject.position.y + gameObject.height;

    return (topOfBall <= bottomOfGameObject && bottomOfBall >= topOfGameObject &&
        ball.position.x >= leftSideOfGameObject &&
        ball.position.x + ball.size <= rightSideOfGameObject);

};

//Brick function
function Brick(position) {

    this.image = document.getElementById('brick-img');

    this.width = 80;
    this.height = 24;

    this.position = position;
    this.markedForRemoval = false;

    this.draw = ctx => {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    };

    this.update = () => {

        if (detectCollision(this)) {
            ball.speed.y = -ball.speed.y;
            this.markedForRemoval = true;
        }
    };
};

//Levels

const level1 = [
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1]
];

const level2 = [
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1]
];

const level3 = [
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1],
];

const biuldLevel = level => {
    let bricks = [];

    /*Method 1*/
    // level.forEach((row, rowIndex) => {
    //     row.forEach((brick, brickIndex) => {
    //         if (brick === 1) {
    //             let position = {
    //                 x: 80 * brickIndex,
    //                 y: 20 + 24 * rowIndex
    //             };

    //             bricks.push(new Brick(position));
    //         }
    //     });
    // });

    /*Method 2*/
    for (let rowIndex = 0; rowIndex < level.length; rowIndex++) {
        for (
            let brickIndex = 0; brickIndex < level[rowIndex].length; brickIndex++
        ) {
            if (level[rowIndex][brickIndex] === 1) {
                let position = {
                    x: 80 * brickIndex,
                    y: 75 + 24 * rowIndex
                };

                bricks.push(new Brick(position));
            }
        }
    }

    return bricks;
};

//Input handler function
function inputHandler(paddle, game) {

    document.addEventListener('keydown', event => {
        switch (event.keyCode) {
            case 37:
                paddle.moveLeft();
                break;
            case 39:
                paddle.moveRight();
                break;
        }
    });

    document.addEventListener('keyup', event => {
        switch (event.keyCode) {
            case 37:
                if (paddle.speed < 0) {
                    paddle.stop();
                }
                break;
            case 39:
                if (paddle.speed > 0) {
                    paddle.stop();
                }
                break;

            case 27:
                game.togglePause();
                break;

            case 32:
                game.start();
                break;

            default:
                console.log(`You've clicked the key with the key code: ${event.keyCode}`);
                break;
        }
    });


};

//Startup

const canvas = document.getElementById('game-screen');
const ctx = canvas.getContext('2d');
const GAME_WIDTH = parseInt(canvas.getAttribute('width'));
const GAME_HEIGHT = parseInt(canvas.getAttribute('height'));
style('blue');

ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

const paddle = new Paddle(GAME_WIDTH, GAME_HEIGHT, 'white');

const ball = new Ball(GAME_WIDTH, GAME_HEIGHT);

let brickObj = {};
brickObj.levels = [level1, level2, level3];
brickObj.levelIndex = 0;
brickObj.bricks = biuldLevel(brickObj.levels[brickObj.levelIndex]);


inputHandler(paddle, GAME);

requestAnimationFrame(gameLoop);

//GameLoop

let lastTime = 0;

function gameLoop(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    document.getElementById('lives').innerText = `Lives: ${GAME.lives}`;

    // Managing the state of the game
    if (GAME.gamestate === GAMESTATE.RUNNING) {
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        ball.draw(ctx);
        paddle.draw(ctx);

        ball.update(deltaTime);
        paddle.update(deltaTime);

        brickObj.bricks.forEach((brick) => {
            brick.draw(ctx);
            brick.update();
        });
        brickObj.bricks = brickObj.bricks.filter(brick => !brick.markedForRemoval);
        GAME.update();

        //Working with levels
        if (brickObj.bricks.length === 0) {
            //Detecting if all the levels were completed
            if (brickObj.levelIndex + 1 === brickObj.levels.length) {
                GAME.gamestate = GAMESTATE.GAMEOVER;
            } else {
                brickObj.levelIndex++;
                console.log(`You have reached Level ${brickObj.levelIndex+1}!`);
                brickObj.bricks = biuldLevel(brickObj.levels[brickObj.levelIndex]);
                ball.reset();
            }
        }
    } else if (GAME.gamestate === GAMESTATE.PAUSED) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Paused', GAME_WIDTH / 2, GAME_HEIGHT / 2);
    } else if (GAME.gamestate === GAMESTATE.MENU) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACEBAR To Start', GAME_WIDTH / 2, GAME_HEIGHT / 2);
    } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2);
    }
    requestAnimationFrame(gameLoop);
}
