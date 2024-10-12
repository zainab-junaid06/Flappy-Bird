let board; 
let boardWidth = 360;
let boardHeight = 640;
let context;

// bird
let birdWidth = 40; // width/height ratio = 408/228 = 17/12
let birdHeight = 50;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;
let velocityY = 0;
let gravity = 0.3;
let jump = -5;

// pipes
let pipeArray = [];
let pipeWidth = 62;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;
let velocityX = -2;

let gameOver = false;
let gameStarted = false; // New flag for game start state
let score = 0;
let highScore = 0; // High score
let gameHasStarted = false;


window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); // Initialize context here

    // Call update after context is defined
    requestAnimationFrame(update);
    setInterval(placePipes, 1500); // Create new pipes every 1.5 seconds
    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("click", handleClick);

    // Load bird image
    birdImg = new Image();
    birdImg.src =
        "https://scontent.xx.fbcdn.net/v/t1.15752-9/462544436_3737985666451884_3027329620737892627_n.png?_nc_cat=106&ccb=1-7&_nc_sid=0024fc&_nc_ohc=yv6C0Sh270IQ7kNvgHTtxOr&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&_nc_gid=Aj5JF-tnP9WVA6MauseJNFi&oh=03_Q7cD1QFD3f6bONnzwEx3_0pyNqlrUxLcaGPt-C_ry0-e4DdW6Q&oe=6731EF49";

    // Load pipe images
    topPipeImg = new Image();
    topPipeImg.src =
        "https://scontent.xx.fbcdn.net/v/t1.15752-9/375765048_339231741777449_1144859979445887528_n.png?stp=dst-png_p320x320&_nc_cat=104&ccb=1-7&_nc_sid=0024fc&_nc_ohc=QW6dGCAbmd4Q7kNvgFjvVkx&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&_nc_gid=AD5wZR37_7Tt7yepUq2SPGg&oh=03_Q7cD1QFfRYnQX__VxsLLYJm47Yj7a_2oeu73pWdUGXMdVS6peQ&oe=672DF180";

    bottomPipeImg = new Image();
    bottomPipeImg.src =
        "https://scontent.xx.fbcdn.net/v/t1.15752-9/375444376_1046950696675618_1974319106848071486_n.png?stp=dst-png_p320x320&_nc_cat=111&ccb=1-7&_nc_sid=0024fc&_nc_ohc=zOyfCk9yCBIQ7kNvgH4gm9V&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&_nc_gid=Aphl-ZTHoCL41ZG_OtwrQbT&oh=03_Q7cD1QEbBxWC_aggfwJfYkyfic6Xwo6AWB0S4_g7HV9Qzb-qJQ&oe=673060EE";
};

// Function to update the game state
// Function to update the game state
// Function to update the game state
// Function to update the game state
// Function to update the game state
function update() {
    context.clearRect(0, 0, board.width, board.height); // Clear the canvas each frame

    if (!gameStarted) {
        context.fillStyle = "white";
        context.font = "30px Brush Script MT";
        let text = "Press Space or Tap";
        let text2 = "to Start";
        let xPosition = (board.width - context.measureText(text).width) / 2;
        let xPosition2 = (board.width - context.measureText(text2).width) / 2;
        context.fillText(text, xPosition, board.height / 2 - 30);
        context.fillText(text2, xPosition2, board.height / 2 + 30);
        return; // Exit the update function
    }

    // Apply gravity to the bird
    velocityY += gravity; // Increase velocityY due to gravity
    birdY += velocityY; // Update bird position based on velocity

    // Check for game over condition (bird falls off the screen)
    if (birdY > boardHeight || birdY < 0) {
        gameOver = true; // Set game over
    }
    

    // Draw the bird
    context.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);

    // Draw pipes and check collisions
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX; // Move pipes to the left

        // Draw the pipe
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        // Check for collision
        if (checkCollision(birdX, birdY, birdWidth, birdHeight, pipe)) {
            gameOver = true; // Set game over if collision occurs
        }

        // Check if the bird has passed the pipe
        if (!pipe.passed && pipe.x + pipe.width < birdX) {
            pipe.passed = true; // Mark the pipe as passed
            score += 0.5; // Increase score by 0.5 because both top and bottom pipes count as one
        }
    }

    // Remove off-screen pipes
    pipeArray = pipeArray.filter(pipe => pipe.x + pipe.width > 0);

    // Draw the score
    context.fillStyle = "white";
    context.font = "25px Comic Sans MS";
    context.fillText("Score: " + Math.floor(score), 5, 45);
    context.fillText("High Score: " + highScore, boardWidth - 180, 45);

    // If the game is over, show restart message
    if (gameOver) {
        context.fillStyle = "white";
        context.font = "30px Brush Script MT";
        let restartText = "Press Space or Tap to Restart";
        let restartTextWidth = context.measureText(restartText).width;
        let xRestartPosition = (board.width - restartTextWidth) / 2;
        context.fillText(restartText, xRestartPosition, board.height / 2);
        return; // Stop the game from updating further
    }

    // Keep updating the game frame
    requestAnimationFrame(update);
}

// Function to place pipes
// Function to place pipes
function placePipes() {
    if (!gameStarted || gameOver) return; // Don't place pipes if the game hasn't started or if it's over

    let gap = 150; // Define the gap between top and bottom pipes
    let minPipeHeight = 50; // Minimum height for top pipe
    let maxPipeHeight = boardHeight - gap - minPipeHeight; // Maximum height for the top pipe, ensuring room for the bottom pipe and the gap

    // Generate a random height for the top pipe, making sure it's between min and max
    let randomPipeHeight = Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight;

    // Create the top pipe
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeHeight - pipeHeight, // Set top pipe's y-position so it's cut off at the top
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    };

    // Create the bottom pipe below the top pipe with the gap
    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeHeight + gap, // Position the bottom pipe at the end of the gap
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    };

    // Push both pipes to the pipe array
    pipeArray.push(topPipe);
    pipeArray.push(bottomPipe);
}

// Function to move the bird on space key press or click/tap
function moveBird() {
    velocityY = jump;
}

// Function to handle key press for both starting, jumping, and restarting the game
// Function to handle key press for both starting, jumping, and restarting the game
function handleKeyPress(e) {
    if (e.code === "Space") {
        if (!gameStarted) {
            gameStarted = true; // Start the game if not already started
            gameHasStarted = true; // Set the flag to indicate the game has started
            requestAnimationFrame(update);
        } else if (gameOver) {
            resetGame(); // Restart the game if it's over
        } else {
            moveBird(); // Make the bird jump if the game is running
        }
    }
}

// Function to handle mouse clicks or taps to start or jump
function handleClick(e) {
    if (!gameStarted) {
        gameStarted = true; // Start the game if not already started
        gameHasStarted = true; // Set the flag to indicate the game has started
        requestAnimationFrame(update);
    } else if (gameOver) {
        resetGame(); // Restart the game if it's over
    } else {
        moveBird(); // Make the bird jump if the game is running
    }
}

// Function to reset the game state
function resetGame() {
    highScore = Math.max(highScore, score); // Update high score when game resets
    birdY = boardHeight / 2;
    velocityY = 0;
    pipeArray = [];
    score = 0;
    gameOver = false;
    requestAnimationFrame(update);
}


// Function to check collision between bird and pipe
function checkCollision(bx, by, bw, bh, pipe) {
    let px = pipe.x;
    let py = pipe.y;
    let pw = pipe.width;
    let ph = pipe.height;

    // Check for collision with pipe
    if (
        bx < px + pw &&
        bx + bw > px &&
        by < py + ph &&
        by + bh > py
    ) {
        return true;
    }
    return false;
}
 
