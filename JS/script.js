let snakeBody, food, direction, allowedToMove, isPlaying;
let map;
let speed = 1;
let play;

function initializeVariables() 
{
    snakeBody = [[0, 0]];
    food = 0;
    direction = "Right";
    allowedToMove = false;
    isPlaying = false;
}

// Creating the map and initializing variables
function initializeGameState(mapElementId) 
{
    map = document.getElementById(mapElementId);
    initializeVariables();

    // Generating the map pixels
    for (let i = 0; i < 400; i++) 
    {
        let pixel = document.createElement("div");
        pixel.setAttribute("class", "pixel");
        //pixel.innerText = i;
        map.appendChild(pixel);
    }

    // Generating the snake body and food
    map.children[0].classList.add("snake-body");
    generateFood();
}

function generateFood() 
{
    // To prevent generating food over the snake
    while (map.children[food].classList.contains("snake-body")) 
    {
        food = Math.floor(Math.random() * 400);
    }
    // Placing food on the map
    map.children[food].classList.add("food");
}

function startGame() 
{
    if (!isPlaying) 
    {
        allowedToMove = true;
        play = setInterval(updatePosition, (500 / speed));
        document.querySelector("#menu").style.display = "none";
        document.querySelector("#map").style.display = "";
        isPlaying = true;
    }
}

function pauseGame() {
    if (isPlaying) {
        allowedToMove = false;
        clearInterval(play);
        document.querySelector("#menu-text").innerText =
            "PAUSED\nPress ENTER to resume";
        document.querySelector("#menu").style.display = "";
        document.querySelector("#map").style.display = "none";
        isPlaying = false;
    }
}

function gameOver() 
{
    clearInterval(play);
    document.querySelector("#menu-text").innerText =
        "Game Over\nYour Score: " +
        ((snakeBody.length-1)*10) +
        "\nPress ENTER to restart";
    document.querySelector("#menu").style.display = "";
    document.querySelector("#map").style.display = "none";
    map.innerText = ""; // Clearing the map
    initializeGameState(map.id); // Re-generating the map
}

function updatePosition() 
{
    let row, col;
    let head = snakeBody[snakeBody.length - 1];

    switch (direction) {
        case "Up":
            row = head[0] - 2
            col = head[1];
            break;
        case "Down":
            row = head[0] + 2;
            col = head[1];
            break;
        case "Left":
            row = head[0];
            col = head[1] - 1;
            break;
        case "Right":
            row = head[0];
            col = head[1] + 1;
            break;
        default:
            break;
    }
    // Checking if snake hit the wall
    // if (row < 0 || row > 38 || col < 0 || col > 19)  gameOver();
    if (row < 0)  row = 38;
    else if (row > 38) row = 0;
    else if (col < 0)  col = 19;
    else if (col > 19) col = 0;

    snakeBody.push([row, col]);
    updateScreen();
    allowedToMove = true;
}

function updateScreen() 
{
    let tailArray = snakeBody.shift();   

    let tail = tailArray[0]*10 + Number(tailArray[1]);

    let headArray = snakeBody[snakeBody.length - 1];

    let head = headArray[0]*10 + Number(headArray[1]);

    // Checking if the snake bite its body
    if (map.children[head].classList.contains("snake-body")) gameOver(); 
    else {
        // Adds the new head block
        map.children[head].classList.add("snake-body");

        // Removes the tail block
        map.children[tail].classList.remove("snake-body");

        // If snake eats the food
        if (head == food) 
        {
            map.children[food].classList.remove("food");
            snakeBody.unshift(tailArray);
            // Checking if the snake reached its max size
            snakeBody.length == 200 && gameOver();
            // Add speed after 5 doses
            if(!(snakeBody.length % 5))
            { 
                //console.log(`snakeBody.length = ${snakeBody.length}`);
                speed += 0.25;
                clearInterval(play);
                play = setInterval(updatePosition, (500 / speed));
            }
            generateFood();
        }      
    }
}

// CONTROLS
document.onkeyup = (e) => 
{
    if (e.key == " " || e.code == "Space" || e.keyCode == 32) 
    {  pauseGame();  }
}

document.onkeydown = keyPress;
function keyPress(e) 
{
    e.preventDefault();
    e = e || window.event;

    // Enter key is pressed
    e.keyCode == 13 && startGame();
    let up = 38;
    let down = 40;
    let left = 37;
    let right = 39;

    if (allowedToMove) 
    {
        allowedToMove = false;
        switch (e.keyCode) 
        {
            case left:
                direction != "Right" && (direction = "Left");
                break;
            case up:
                direction != "Down" && (direction = "Up");
                break;
            case right:
                direction != "Left" && (direction = "Right");
                break;
            case down:
                direction != "Up" && (direction = "Down");
                break;
            default:
                allowedToMove = true;
                break;
        }
    }
}
// Initiates the game
initializeGameState("map");

