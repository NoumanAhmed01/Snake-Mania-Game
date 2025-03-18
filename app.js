// Game Constants & Variables
const foodSound = new Audio("music/food.mp3"); // Sound played when snake eats food
const gameOverSound = new Audio("music/gameover.mp3"); // Sound played when the game is over
const moveSound = new Audio("music/move.mp3"); // Sound played when snake moves
const musicSound = new Audio("music/music.mp3"); // Background music during the game
let inputDir = { x: 0, y: 0 }; // Direction object to store the direction of snake's movement
let speed = 19; // Speed of the snake (higher value means faster)
let score = 0; // Player's score
let lastPaintTime = 0; // Keeps track of the last time the game was updated
let snakeArr = [{ x: 13, y: 15 }]; // Array to store the position of the snake (initially with 1 segment)

food = { x: 6, y: 7 }; // Initial position of the food on the grid

// Game Functions

// Main function that keeps the game running (called every frame)
function main(ctime) {
  window.requestAnimationFrame(main); // Continuously call the main function to animate the game
  // console.log(ctime) // Shows the current time (for debugging)

  // Control the speed of the game: only run the game engine if enough time has passed
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return; // Exit the function if the required time hasn't passed yet
  }

  lastPaintTime = ctime; // Update the last time the game was updated
  gameEngine(); // Call the game engine to update game logic and display
}

// Function to check if the snake collides with itself or the walls
function isCollide(snake) {
  // Check if the snake collides with itself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true; // Return true if the head of the snake touches any part of its body
    }
  }
  // Check if the snake collides with the wall (grid size is 18x18)
  if (
    snake[0].x >= 18 ||
    snake[0].x <= 0 ||
    snake[0].y >= 18 ||
    snake[0].y <= 0
  ) {
    return true; // Return true if the snake's head goes beyond the grid boundaries
  }

  return false; // If no collision, return false
}

// Function to handle all the game logic (moving snake, eating food, displaying elements)
function gameEngine() {
  // Part 1: Updating the snake array & food

  // Check if the snake has collided (game over condition)
  if (isCollide(snakeArr)) {
    gameOverSound.play(); // Play game over sound
    musicSound.pause(); // Pause background music
    inputDir = { x: 0, y: 0 }; // Stop the snake's movement
    alert("Game Over. Press any key to play again!"); // Show game over message
    snakeArr = [{ x: 13, y: 15 }]; // Reset the snake to its starting position
    musicSound.play(); // Restart the background music
    score = 0; // Reset the score
  }

  // If the snake eats the food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play(); // Play food eating sound
    score += 1; // Increment score

    // Check if current score is higher than the high score
    if (score > hiscoreval) {
      hiscoreval = score; // Update high score
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval)); // Store new high score in local storage
      hiscoreBox.innerHTML = "High Score: " + hiscoreval; // Update high score display
    }

    scoreBox.innerHTML = "Score: " + score; // Update current score display

    // Add a new segment to the snake (it grows after eating food)
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x, // New head position (in the current direction)
      y: snakeArr[0].y + inputDir.y,
    });

    // Generate new random position for the food
    let a = 2;
    let b = 16;
    food = {
      x: Math.round(a + (b - a) * Math.random()), // Random x position
      y: Math.round(a + (b - a) * Math.random()), // Random y position
    };
  }

  // Moving the snake
  // Move each segment to the position of the previous one
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] }; // Shift each segment forward
  }

  // Move the head of the snake in the direction set by inputDir
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // Part 2: Display the snake and the food

  // Clear the previous display
  board.innerHTML = "";

  // Display the snake
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div"); // Create a div element for each part of the snake
    snakeElement.style.gridRowStart = e.y; // Set the row position for the snake part
    snakeElement.style.gridColumnStart = e.x; // Set the column position for the snake part

    // If it's the head, give it a different style
    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement); // Add the snake part to the game board
  });

  // Display the food
  foodElement = document.createElement("div"); // Create a div element for the food
  foodElement.style.gridRowStart = food.y; // Set the row position for the food
  foodElement.style.gridColumnStart = food.x; // Set the column position for the food
  foodElement.classList.add("food"); // Add the 'food' class to style it
  board.appendChild(foodElement); // Add the food element to the game board
}

// Main logic starts here

musicSound.play(); // Start playing background music

// Get the high score from local storage (if exists) or set it to 0
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval)); // Store initial high score as 0
} else {
  hiscoreval = JSON.parse(hiscore); // Parse high score from local storage
  hiscoreBox.innerHTML = "High Score: " + hiscore; // Display the high score
}

// Start the game loop using requestAnimationFrame
window.requestAnimationFrame(main);

// Listen for keydown events to move the snake
window.addEventListener("keydown", (e) => {
  inputDir = { x: 0, y: 1 }; // Start moving the snake when any key is pressed
  moveSound.play(); // Play the movement sound

  // Change direction based on arrow key pressed
  switch (e.key) {
    case "ArrowUp":
      console.log("ArrowUp"); // Log the key press for debugging
      inputDir.x = 0;
      inputDir.y = -1; // Move up
      break;

    case "ArrowDown":
      console.log("ArrowDown");
      inputDir.x = 0;
      inputDir.y = 1; // Move down
      break;

    case "ArrowLeft":
      console.log("ArrowLeft");
      inputDir.x = -1;
      inputDir.y = 0; // Move left
      break;

    case "ArrowRight":
      console.log("ArrowRight");
      inputDir.x = 1;
      inputDir.y = 0; // Move right
      break;

    default:
      break; // Do nothing for other keys
  }
});
