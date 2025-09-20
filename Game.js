// Set up the game canvas and play speed
window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    context = canvas.getContext("2d");
    document.addEventListener("keydown", keyPush);
    setInterval(snakeGame, 1000/15);
}

// Variable for position, speed, tail of snake and apple
posX = posY = 10;
gridSize = numTiles = 20;
appleX = appleY = 15;
velX = velY = 0;
trail = [];
tail = 5;

// Main game logic
function snakeGame() {

    // Snake moves at speed defined by user input
    posX += velX;
    posY += velY;

    // Handle contact with boundaries
    if (posX < 0) {
        posX = numTiles-1;
    }
    if (posX > numTiles-1) {
        posX = 0;
    }
    if (posY < 0) {
        posY = numTiles-1;
    }
    if (posY > numTiles-1) {
        posY= 0;
    }

    // Colour game board
    context.fillStyle = "black";
    context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Colour the whole snake
    context.fillStyle = "lime";
    for(var i = 0; i < trail.length; i++) {
        context.fillRect((trail[i].x)*gridSize, (trail[i].y)*gridSize, gridSize-2, gridSize-2);
        // Restart if you eat your own tail
        if((trail[i].x == posX) && (trail[i].y == posY)) {
            tail = 5;
        }
    }
    trail.push({x:posX, y:posY});
    // Remove empty values if tail is shortened
    while(trail.length > tail) {
        trail.shift();
    }

    // Grow after eating apple
    if((appleX == posX) && (appleY == posY)) {
        tail++;
        appleX = Math.floor(Math.random()*numTiles);
        appleY = Math.floor(Math.random()*numTiles);
    }
    // Create new apple in random location
    context.fillStyle = "red";
    context.fillRect(appleX*gridSize, appleY*gridSize, gridSize-2, gridSize-2);
}

// What to do with arrow keys being pressed
function keyPush(evt) {
    switch(evt.keyCode) {
        case 37:
            velX = -1; velY = 0;
            break;
        case 38:
            velX = 0; velY =- 1;
            break;
        case 39:
            velX = 1; velY = 0;
            break;
        case 40:
            velX = 0; velY = 1;
            break;
    }
}
