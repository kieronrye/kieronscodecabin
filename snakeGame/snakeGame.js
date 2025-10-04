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
let score = 0;
let lastScore = 0; // Stores score when player dies

// Music control
let musicStarted = false;
const music = document.getElementById("gameMusic");

function snakeGame() {
    if (!isPaused) {  // Only update game if not paused
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
            score++;  // Increment score
            appleX = Math.floor(Math.random() * numTiles);
            appleY = Math.floor(Math.random() * numTiles);
        }

        // Move snake trail
        trail.push({ x: posX, y: posY });
        while (trail.length > tail) {
            trail.shift();
        }

        // Check self-collision
        for (let i = 0; i < trail.length - 1; i++) {
            if (trail[i].x === posX && trail[i].y === posY) {
                // Snake died → save score, reset tail, pause game
                lastScore = score; // Save score before reset
                score = 0;
                tail = 5;
                velX = velY = 0;
                isPaused = true;
                break;
            }
        }
    }

    // Draw game board
    context.fillStyle = "black";
    context.fillRect(0, 0, 400, 400);

    // Draw snake
    context.fillStyle = "lime";
    for (let i = 0; i < trail.length; i++) {
        context.fillRect(trail[i].x * gridSize, trail[i].y * gridSize, gridSize - 2, gridSize - 2);
    }

    // Draw apple
    context.fillStyle = "red";
    context.fillRect(appleX * gridSize, appleY * gridSize, gridSize - 2, gridSize - 2);

    // Draw score
    context.fillStyle = "#ff00ff";
    context.font = "20px monospace";
    context.fillText("Score: " + score, 10, 30);

    // Draw paused or score message
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
        // If game was paused after death → reset game
        if (isPaused && lastScore > 0) {
            resetGame();
        }

        // If game is paused (manual pause), unpause
        if (isPaused) {
            isPaused = false;
        }

        // Move snake
        switch (evt.keyCode) {
            case 37: velX = -1; velY = 0; break; // Left
            case 38: velX = 0; velY = -1; break; // Up
            case 39: velX = 1; velY = 0; break;  // Right
            case 40: velX = 0; velY = 1; break;  // Down
        }
    }

    // Space bar toggles pause
    if (evt.keyCode === 32) {
        isPaused = !isPaused;
    }

    // Start music on first movement (ignore space bar)
    if (!musicStarted && evt.keyCode !== 32) {
        music.play().catch(err => console.log("Autoplay blocked:", err));
        musicStarted = true;
    }
}

// Reset game after death
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
}
