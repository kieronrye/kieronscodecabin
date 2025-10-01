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

function snakeGame() {
    posX += velX;
    posY += velY;

    // Wrap around edges
    if (posX < 0) posX = numTiles - 1;
    if (posX > numTiles - 1) posX = 0;
    if (posY < 0) posY = numTiles - 1;
    if (posY > numTiles - 1) posY = 0;

    // Draw game board
    context.fillStyle = "black";
    context.fillRect(0, 0, 400, 400);

    // Draw snake
    context.fillStyle = "lime";
    for (let i = 0; i < trail.length; i++) {
        context.fillRect(trail[i].x * gridSize, trail[i].y * gridSize, gridSize - 2, gridSize - 2);

        // If snake eats itself → reset
        if (trail[i].x === posX && trail[i].y === posY) {
            tail = 5;
        }
    }
    trail.push({ x: posX, y: posY });

    while (trail.length > tail) {
        trail.shift();
    }

    // Eat apple → grow
    if (appleX === posX && appleY === posY) {
        tail++;
        appleX = Math.floor(Math.random() * numTiles);
        appleY = Math.floor(Math.random() * numTiles);
    }

    // Draw apple
    context.fillStyle = "red";
    context.fillRect(appleX * gridSize, appleY * gridSize, gridSize - 2, gridSize - 2);
}

// Handle keyboard input
function keyPush(evt) {
    switch (evt.keyCode) {
        case 37: velX = -1; velY = 0; break; // Left
        case 38: velX = 0; velY = -1; break; // Up
        case 39: velX = 1; velY = 0; break;  // Right
        case 40: velX = 0; velY = 1; break;  // Down
    }
}
