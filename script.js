const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 📱 Fixed Mobile Size
canvas.width = 360;
canvas.height = 600;

let gameState = "start";

let playerImage = new Image();
playerImage.src = "start.png";

let blockImage = new Image();
blockImage.src = "start.png";

// Mobile Optimized Player
let player = {
    x: 60,
    y: 250,
    width: 50,
    height: 50,
    gravity: 0.07,
    lift: -3,
    velocity: 0
};

let pipes = [];
let pipeWidth = 70;
let gap = 230; // easy gap
let frame = 0;
let score = 0;

const playMusic = document.getElementById("playMusic");
const endMusic = document.getElementById("endMusic");

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(blockImage, pipe.x, 0, pipeWidth, pipe.top);
        ctx.drawImage(blockImage, pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
    });
}

function updateGame() {
    if (gameState !== "playing") return;

    player.velocity += player.gravity;
    player.y += player.velocity;

    if (player.y + player.height > canvas.height || player.y < 0) {
        endGame();
    }

    if (frame % 150 === 0) {
        let top = Math.random() * 200 + 50;
        pipes.push({
            x: canvas.width,
            top: top,
            bottom: top + gap
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= 1;

        if (
            player.x < pipe.x + pipeWidth &&
            player.x + player.width > pipe.x &&
            (player.y < pipe.top || player.y + player.height > pipe.bottom)
        ) {
            endGame();
        }

        if (pipe.x === player.x) {
            score++;
            document.getElementById("score").innerText = score;
        }
    });

    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

function endGame() {
    if (gameState !== "playing") return;

    gameState = "gameover";
    playMusic.pause();
    endMusic.play();
    document.getElementById("gameOverScreen").classList.remove("hidden");
}

function resetGame() {
    player.y = 250;
    player.velocity = 0;
    pipes = [];
    score = 0;
    frame = 0;

    document.getElementById("score").innerText = score;
    document.getElementById("gameOverScreen").classList.add("hidden");
    document.getElementById("startScreen").classList.remove("hidden");

    gameState = "start";
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawPipes();
    updateGame();

    frame++;
    requestAnimationFrame(gameLoop);
}

// 📱 Touch Control Only (Mobile)
canvas.addEventListener("touchstart", function (e) {
    e.preventDefault();
    if (gameState === "playing") {
        player.velocity = player.lift;
    }
});

// Start
document.getElementById("startBtn").onclick = () => {
    gameState = "playing";
    document.getElementById("startScreen").classList.add("hidden");
    playMusic.loop = true;
    playMusic.play();
};

// Restart
document.getElementById("restartBtn").onclick = resetGame;

gameLoop();