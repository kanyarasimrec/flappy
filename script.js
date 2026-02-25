const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 📱 Fixed Mobile Size
canvas.width = 360;
canvas.height = 600;

let gameState = "start";

// ============================
// 🎮 LOAD PLAYER IMAGE
// ============================
let playerImage = new Image();
playerImage.src = "start.png"; // your player image

// ============================
// 🔥 LOAD PIPE SPRITE FRAMES
// ============================
let blockFrames = [];
let totalFrames = 14; // 🔁 change to your actual frame count

for (let i = 1; i <= totalFrames; i++) {
    let img = new Image();
    img.src = `block${i}.png`;
    blockFrames.push(img);
}

let frameIndex = 0;
let animationSpeed = 6;  // smaller = faster animation
let animationCounter = 0;

// ============================
// 🧍 PLAYER SETTINGS
// ============================
let player = {
    x: 60,
    y: 250,
    width: 50,
    height: 50,
    gravity: 0.09,
    lift: -3,
    velocity: 0
};

let pipes = [];
let pipeWidth = 70;
let gap = 230;
let frame = 0;
let score = 0;

const playMusic = document.getElementById("playMusic");
const endMusic = document.getElementById("endMusic");

// ============================
// 🎨 DRAW FUNCTIONS
// ============================
function drawPlayer() {
    
    if (!playerImage.complete) return;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(player.x, player.y, player.width, player.height, 10);
    ctx.clip();

    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    ctx.restore();

}


function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(
            blockFrames[frameIndex],
            pipe.x,
            0,
            pipeWidth,
            pipe.top
        );

        ctx.drawImage(
            blockFrames[frameIndex],
            pipe.x,
            pipe.bottom,
            pipeWidth,
            canvas.height - pipe.bottom
        );
    });
}

// ============================
// 🎯 GAME LOGIC
// ============================
function updateGame() {
    if (gameState !== "playing") return;

    player.velocity += player.gravity;
    player.y += player.velocity;

    // Ground / Top collision
    if (player.y + player.height > canvas.height || player.y < 0) {
        endGame();
    }

    // Generate pipes
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

        // Collision
        if (
            player.x < pipe.x + pipeWidth &&
            player.x + player.width > pipe.x &&
            (player.y < pipe.top || player.y + player.height > pipe.bottom)
        ) {
            endGame();
        }

        // Score
        if (pipe.x === player.x) {
            score++;
            document.getElementById("score").innerText = score;
        }
    });

    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

// ============================
// 💀 END GAME
// ============================
function endGame() {
    if (gameState !== "playing") return;

    gameState = "gameover";

    // 🔥 Completely stop play music
    playMusic.pause();
    playMusic.currentTime = 0;   // reset to beginning

    // Play end music
    endMusic.currentTime = 0;    // start from beginning
    endMusic.play();

    document.getElementById("gameOverScreen").classList.remove("hidden");
}

// ============================
// 🔄 RESET
// ============================
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

// ============================
// 🔄 GAME LOOP
// ============================
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawPipes();
    updateGame();

    // 🔥 Smooth Pipe Animation
    animationCounter++;
    if (animationCounter >= animationSpeed) {
        frameIndex++;
        if (frameIndex >= totalFrames) {
            frameIndex = 0;
        }
        animationCounter = 0;
    }

    frame++;
    requestAnimationFrame(gameLoop);
}

// ============================
// 📱 TOUCH CONTROL
// ============================
canvas.addEventListener("touchstart", function (e) {
    e.preventDefault();
    if (gameState === "playing") {
        player.velocity = player.lift;
    }
});

// ============================
// ▶ START BUTTON
// ============================
document.getElementById("startBtn").onclick = () => {
    gameState = "playing";
    document.getElementById("startScreen").classList.add("hidden");

    playMusic.currentTime = 0;  // start fresh
    playMusic.loop = true;
    playMusic.play();
};

// ============================
// 🔁 RESTART BUTTON
// ============================
document.getElementById("restartBtn").onclick = resetGame;

gameLoop();
