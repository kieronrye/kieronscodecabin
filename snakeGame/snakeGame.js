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

// Music control
const music = document.getElementById("gameMusic");
let musicStarted = false;

// Win music
const winMusic = new Audio("snakeGame/sounds/oasis.mp3");

function snakeGame() {
    // If game is completed, freeze everything
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

            // ✅ Check for game completion
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

// Draw game board and UI
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

    // Draw score
    context.fillStyle = "#ff00ff";
    context.font = "20px monospace";
    context.fillText("Score: " + score, 10, 30);

    // Game completed
    if (isGameCompleted) {
        context.fillStyle = "#ff00ff";
        context.font = "25px monospace";
        context.fillText("YOU COMPLETED THE GAME!", 25, 200);
        context.font = "18px monospace";
        context.fillText("Press any arrow key to play again", 40, 230);
        return;
    }

    // Paused or score message
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

    // Arrow key pressed
    if (arrowKeys.includes(evt.keyCode)) {
        // Restart if game completed
        if (isGameCompleted) {
            resetGame();
            return;
        }

        // If game was paused after death → reset game
        if (isPaused && lastScore > 0) {
            resetGame();
        }

        // If game is paused (manual pause or after death), unpause
        if (isPaused) {
            isPaused = false;
            playMusic();
        }

        // Move snake
        switch (evt.keyCode) {
            case 37: velX = -1; velY = 0; break; // Left
            case 38: velX = 0; velY = -1; break; // Up
            case 39: velX = 1; velY = 0; break;  // Right
            case 40: velX = 0; velY = 1; break;  // Down
        }

        // Start music on first movement
        if (!musicStarted) {
            playMusic();
            musicStarted = true;
        }
    }

    // Space bar toggles pause
    if (evt.keyCode === 32 && !isGameCompleted) {
        isPaused = !isPaused;
        if (isPaused) {
            pauseMusic();
        } else {
            playMusic();
        }
    }
}

// Complete the game
function completeGame() {
    isGameCompleted = true;
    velX = velY = 0;
    pauseMusic();
    winMusic.play().catch(err => console.log("Autoplay blocked:", err));
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
    playMusic();
}

// Music helper functions
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
