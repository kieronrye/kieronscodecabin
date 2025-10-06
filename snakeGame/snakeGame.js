// Wait for page to load
window.onload = function() {
    const canvas = document.getElementById("gameCanvas");
    context = canvas.getContext("2d");

    document.addEventListener("keydown", keyPush);
    setInterval(snakeGame, 1000 / 5); // 5 frames per second
};

// Snake state variables
let posX = 10, posY = 10;
const gridSize = 20, numTiles = 20;
let appleX = 15, appleY = 15;
let velX = 0, velY = 0;
let trail = [];
let tail = 5;

// Game state
let isPaused = false;
let isGameCompleted = false;
let score = 0;
let lastScore = 0;

// DOM elements
const music = document.getElementById("gameMusic");
const mandImage = document.getElementById("mandImage");
const canvas = document.getElementById("gameCanvas");
const canvasContainer = document.getElementById("canvasContainer");

// Music control
let musicStarted = false;
const winMusic = new Audio("sounds/oasis.mp3");
winMusic.volume = 0.8; // optional

function snakeGame() {
    if (isGameCompleted) {
        drawGame();
        return;
    }

    if (!isPaused) {
        posX += velX;
        posY += velY;

        // Wrap around edges
        if (posX < 0) posX = numTiles - 1;
        if (posX > numTiles - 1) posX = 0;
        if (posY < 0) posY = numTiles - 1;
        if (posY > numTiles - 1) posY = 0;

        // Eat apple → grow
        if (appleX === posX && appleY === posY) {
            tail++;
            score++;
            appleX = Math.floor(Math.random() * numTiles);
            appleY = Math.floor(Math.random() * numTiles);

            // ✅ Trigger completion at score 20
            if (score >= 20) {
                completeGame();
                return;
            }
        }

        // Move snake trail
        trail.push({ x: posX, y: posY });
        while (trail.length > tail) {
            trail.shift();
        }

        // Check self-collision
        for (let i = 0; i < trail.length - 1; i++) {
            if (trail[i].x === posX && trail[i].y === posY) {
                lastScore = score;
                score = 0;
                tail = 5;
                velX = velY = 0;
                isPaused = true;
                pauseMusic();
                break;
            }
        }
    }

    drawGame();
}

function drawGame() {
    context.fillStyle = "black";
    context.fillRect(0, 0, 400, 400);

    // Draw snake
    context.fillStyle = "lime";
    for (let i = 0; i < trail.length; i++) {
        context.fillRect(trail[i].x * gridSize, trail[i].y * gridSize, gridSize - 2, gridSize - 2);
    }

    // Draw apple
    if (!isGameCompleted) {
        context.fillStyle = "red";
        context.fillRect(appleX * gridSize, appleY * gridSize, gridSize - 2, gridSize - 2);
    }

    // Score display
    context.fillStyle = "#ff00ff";
    context.font = "20px monospace";
    context.fillText("Score: " + score, 10, 30);

    // Completion message
    if (isGameCompleted) {
        context.fillStyle = "#ff00ff";
        context.font = "25px monospace";
        context.fillText("YOU COMPLETED THE GAME!", 25, 200);
        context.font = "18px monospace";
        context.fillText("Press an arrow key to play again", 40, 230);
        return;
    }

    // Pause / Death message
    if (isPaused) {
        context.fillStyle = "#ff00ff";
        context.font = "25px monospace";

        if (lastScore > 0) {
            context.fillText("YOUR SCORE IS " + lastScore, 70, 200);
            context.font = "18px monospace";
            context.fillText("Press an arrow key to restart", 60, 230);
        } else {
            context.fillText("PAUSED", 150, 200);
        }
    }
}

// Handle keyboard input
function keyPush(evt) {
    const arrowKeys = [37, 38, 39, 40];

    if (arrowKeys.includes(evt.keyCode)) {
        // Restart after win
        if (isGameCompleted) {
            resetGame();
            return;
        }

        // Restart after death
        if (isPaused && lastScore > 0) {
            resetGame();
        }

        // Unpause
        if (isPaused) {
            isPaused = false;
            playMusic();
        }

        // Movement
        switch (evt.keyCode) {
            case 37: velX = -1; velY = 0; break; // Left
            case 38: velX = 0; velY = -1; break; // Up
            case 39: velX = 1; velY = 0; break;  // Right
            case 40: velX = 0; velY = 1; break;  // Down
        }

        if (!musicStarted) {
            playMusic();
            musicStarted = true;
        }
    }

    // Space = pause toggle
    if (evt.keyCode === 32 && !isGameCompleted) {
        isPaused = !isPaused;
        if (isPaused) pauseMusic();
        else playMusic();
    }
}

// ✅ Handles win condition
function completeGame() {
    isGameCompleted = true;
    velX = velY = 0;
    pauseMusic();

    // Shrink gameplay area smoothly
    canvas.style.width = "200px";
    canvas.style.height = "200px";
    canvasContainer.style.transform = "scale(0.8)";

    // Show Mand image bigger
    mandImage.style.display = "block";
    mandImage.style.width = "300px";
    mandImage.style.opacity = "0";

    mandImage.animate(
        [
            { opacity: 0, transform: "scale(0.5)" },
            { opacity: 1, transform: "scale(1)" }
        ],
        { duration: 800, easing: "ease-out", fill: "forwards" }
    );

    // Play win music after a short delay
    setTimeout(() => {
        winMusic.currentTime = 0;
        winMusic.play().catch(err => console.log("Autoplay blocked:", err));
    }, 300);
}

// Reset game
function resetGame() {
    posX = 10;
    posY = 10;
    appleX = 15;
    appleY = 15;
    velX = velY = 0;
    trail = [];
    tail = 5;
    score = 0;
    lastScore = 0;
    isPaused = false;
    isGameCompleted = false;

    // Restore original canvas size and hide image
    canvas.style.width = "400px";
    canvas.style.height = "400px";
    canvasContainer.style.transform = "scale(1)";
    mandImage.style.display = "none";

    playMusic();
}

// Music controls
function playMusic() {
    if (music.paused) {
        music.play().catch(err => console.log("Autoplay blocked:", err));
    }
}

function pauseMusic() {
    if (!music.paused) {
        music.pause();
    }
}
