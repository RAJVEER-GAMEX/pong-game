const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 15;
const BALL_SPEED = 5;
const PADDLE_SPEED = 6;
const COMPUTER_SPEED = 4;

const gameBoard = document.getElementById('gameBoard');
const leftPaddle = document.getElementById('leftPaddle');
const rightPaddle = document.getElementById('rightPaddle');
const ball = document.getElementById('ball');
const playerScoreDisplay = document.getElementById('playerScore');
const computerScoreDisplay = document.getElementById('computerScore');

let gameState = {
    playerScore: 0,
    computerScore: 0,
    ballX: GAME_WIDTH / 2,
    ballY: GAME_HEIGHT / 2,
    ballVelocityX: BALL_SPEED,
    ballVelocityY: BALL_SPEED,
    leftPaddleY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    rightPaddleY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    keys: {}
};

function init() {
    gameState.ballX = GAME_WIDTH / 2;
    gameState.ballY = GAME_HEIGHT / 2;
    gameState.ballVelocityX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    gameState.ballVelocityY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    gameState.leftPaddleY = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    gameState.rightPaddleY = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2;
}

document.addEventListener('keydown', (e) => {
    gameState.keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    gameState.keys[e.key] = false;
});

gameBoard.addEventListener('mousemove', (e) => {
    const rect = gameBoard.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    gameState.leftPaddleY = Math.max(0, Math.min(mouseY - PADDLE_HEIGHT / 2, GAME_HEIGHT - PADDLE_HEIGHT));
});

function updateLeftPaddle() {
    if (gameState.keys['ArrowUp']) {
        gameState.leftPaddleY = Math.max(0, gameState.leftPaddleY - PADDLE_SPEED);
    }
    if (gameState.keys['ArrowDown']) {
        gameState.leftPaddleY = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, gameState.leftPaddleY + PADDLE_SPEED);
    }
}

function updateRightPaddle() {
    const paddleCenter = gameState.rightPaddleY + PADDLE_HEIGHT / 2;
    const ballCenter = gameState.ballY;

    if (ballCenter < paddleCenter - 10) {
        gameState.rightPaddleY = Math.max(0, gameState.rightPaddleY - COMPUTER_SPEED);
    } else if (ballCenter > paddleCenter + 10) {
        gameState.rightPaddleY = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, gameState.rightPaddleY + COMPUTER_SPEED);
    }
}

function updateBall() {
    gameState.ballX += gameState.ballVelocityX;
    gameState.ballY += gameState.ballVelocityY;

    if (gameState.ballY - BALL_SIZE / 2 <= 0 || gameState.ballY + BALL_SIZE / 2 >= GAME_HEIGHT) {
        gameState.ballVelocityY = -gameState.ballVelocityY;
        gameState.ballY = Math.max(BALL_SIZE / 2, Math.min(GAME_HEIGHT - BALL_SIZE / 2, gameState.ballY));
    }

    if (
        gameState.ballX - BALL_SIZE / 2 <= PADDLE_WIDTH + 10 &&
        gameState.ballY >= gameState.leftPaddleY &&
        gameState.ballY <= gameState.leftPaddleY + PADDLE_HEIGHT
    ) {
        gameState.ballVelocityX = -gameState.ballVelocityX;
        gameState.ballX = PADDLE_WIDTH + 10 + BALL_SIZE / 2;
        
        const hitPos = (gameState.ballY - gameState.leftPaddleY) / PADDLE_HEIGHT;
        gameState.ballVelocityY = (hitPos - 0.5) * 10;
    }

    if (
        gameState.ballX + BALL_SIZE / 2 >= GAME_WIDTH - PADDLE_WIDTH - 10 &&
        gameState.ballY >= gameState.rightPaddleY &&
        gameState.ballY <= gameState.rightPaddleY + PADDLE_HEIGHT
    ) {
        gameState.ballVelocityX = -gameState.ballVelocityX;
        gameState.ballX = GAME_WIDTH - PADDLE_WIDTH - 10 - BALL_SIZE / 2;
        
        const hitPos = (gameState.ballY - gameState.rightPaddleY) / PADDLE_HEIGHT;
        gameState.ballVelocityY = (hitPos - 0.5) * 10;
    }

    if (gameState.ballX < 0) {
        gameState.computerScore++;
        computerScoreDisplay.textContent = gameState.computerScore;
        resetBall();
    }

    if (gameState.ballX > GAME_WIDTH) {
        gameState.playerScore++;
        playerScoreDisplay.textContent = gameState.playerScore;
        resetBall();
    }
}

function resetBall() {
    gameState.ballX = GAME_WIDTH / 2;
    gameState.ballY = GAME_HEIGHT / 2;
    gameState.ballVelocityX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    gameState.ballVelocityY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
}

function render() {
    leftPaddle.style.top = gameState.leftPaddleY + 'px';
    rightPaddle.style.top = gameState.rightPaddleY + 'px';
    ball.style.left = gameState.ballX + 'px';
    ball.style.top = gameState.ballY + 'px';
}

function gameLoop() {
    updateLeftPaddle();
    updateRightPaddle();
    updateBall();
    render();
    requestAnimationFrame(gameLoop);
}

init();
gameLoop();
