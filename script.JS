//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 50; //width/height ratio = 408/228 = 17/12
let birdHeight = 60;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;
let velocityY = 0;
let gravity = 0.3;
let jump = -5;

//pipes
let pipeArray = [];
let pipeWidth = 62;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;
let velocityX = -2;

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Load bird image
    birdImg = new Image();
    birdImg.src = "https://scontent.xx.fbcdn.net/v/t1.15752-9/462541049_1977216879463576_6988947583025851544_n.png?stp=dst-png_s403x403&_nc_cat=106&ccb=1-7&_nc_sid=0024fc&_nc_ohc=7U1jfjmeiM8Q7kNvgFQcn_f&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&_nc_gid=AYVExXDLQODNo20C7NAto8m&oh=03_Q7cD1QEstnmUWZznr3OnkqDDe9vVmJLiQOEvLwVp35bk7jIaFg&oe=672DB71B";

    // Load pipe images
    topPipeImg = new Image();
    topPipeImg.src = "https://scontent.xx.fbcdn.net/v/t1.15752-9/375765048_339231741777449_1144859979445887528_n.png?stp=dst-png_p320x320&_nc_cat=104&ccb=1-7&_nc_sid=0024fc&_nc_ohc=QW6dGCAbmd4Q7kNvgFjvVkx&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&_nc_gid=AXBZ1wJEXcoYHtJId6XlQLt&oh=03_Q7cD1QGPD0d81x9TpooU1KkswBcxZUPj1fuBebjhVORmsPvPTw&oe=672DB940";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "https://scontent.xx.fbcdn.net/v/t1.15752-9/375444376_1046950696675618_1974319106848071486_n.png?stp=dst-png_p320x320&_nc_cat=111&ccb=1-7&_nc_sid=0024fc&_nc_ohc=AuOh8m9fFuYQ7kNvgGdjS1T&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&_nc_gid=AXBZ1wJEXcoYHtJId6XlQLt&oh=03_Q7cD1QFvNOAE2h5kQPKwxCOy7D1qrR7r_gZLK-SG70MBmNtkpw&oe=672DBDEE";

    requestAnimationFrame(update); // Start the game loop
    setInterval(placePipes, 1500);

    // Listen for space key presses to move bird
    document.addEventListener("keydown", handleKeyPress);

    // Listen for mouse clicks/taps to move bird
    document.addEventListener("click", moveBird);
}

function update() {
    if (gameOver) {
        // Draw "Press Space to Restart" text if the game is over
        context.fillStyle = "white";
        context.font = "25px Comic Sans MS";
        context.fillText("Game Over!", 5, 90);
        context.fillText("Press Space to Restart", 5, 140);
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Bird physics
    velocityY += gravity;
    birdY = Math.max(birdY + velocityY, 0);

    if (birdY > board.height) {
        gameOver = true;
    }

    // Draw bird
    context.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);

    // Pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && birdX > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        // Check for off-screen pipes
        if (pipe.x + pipe.width < 0) {
            pipeArray.splice(i, 1);
            i--;
        }

        // Check collision
        if (checkCollision(birdX, birdY, birdWidth, birdHeight, pipe)) {
            gameOver = true;
        }
    }

    // Draw the score
    context.fillStyle = "white";
    context.font = "30px Comic Sans MS";
    context.fillText(score, 5, 45);

    requestAnimationFrame(update); // Keep updating the game frame
}

function placePipes() {
    let randomPipeY = -Math.random() * pipeHeight / 2;

    // Create the top pipe
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
    };

    // Create the bottom pipe below the top pipe with a gap
    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + board.height / 4,  // Ensures gap of board.height / 4
        width: pipeWidth,
        height: pipeHeight,
    };

    // Push both pipes to the pipe array
    pipeArray.push(topPipe);
    pipeArray.push(bottomPipe);
}

// Function to move the bird on space key press or click/tap
function moveBird(e) {
    if ((e.code === "Space" || e.type === "click") && !gameOver) {
        velocityY = jump;
    }
}

// Function to handle key press for both jumping and restarting the game
function handleKeyPress(e) {
    if (e.code === "Space") {
        if (gameOver) {
            resetGame(); // Restart the game if it's over
        } else {
            moveBird(e); // Make the bird jump if the game is running
        }
    }
}

// Function to reset the game
function resetGame() {
    birdY = boardHeight / 2; // Reset bird's position
    velocityY = 0;
    pipeArray = []; // Clear pipes
    score = 0;
    gameOver = false; // Restart the game
    requestAnimationFrame(update); // Continue game loop
}

// Function to check collision
function checkCollision(birdX, birdY, birdWidth, birdHeight, pipe) {
    return birdX < pipe.x + pipe.width &&
           birdX + birdWidth > pipe.x &&
           birdY < pipe.y + pipe.height &&
           birdY + birdHeight > pipe.y;
}
