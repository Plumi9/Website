let player = document.getElementById('player');
let rock = document.getElementById('rock');
let rock_round = document.getElementById('rock_round');
let LIST_OF_OBJECTS = [rock, rock_round];

const MOVEMENT_SPEED = 10;
let positionX = 100;
let positionY = 100;
let keyPresses = {};

window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
  keyPresses[event.key] = true;
}

window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
  keyPresses[event.key] = false;
}

function isColliding(newPositionX, newPositionY) {
  let player_Position = {
    left: newPositionX,
    right: newPositionX + player.offsetWidth,
    top: newPositionY,
    bottom: newPositionY + player.offsetHeight,
  };

  // Check all objects for collision
  for (let object of LIST_OF_OBJECTS) {
    let object_Position = object.getBoundingClientRect();

    if (!(player_Position.top > object_Position.bottom || 
          player_Position.bottom < object_Position.top ||
          player_Position.left > object_Position.right ||
          player_Position.right < object_Position.left)) {
      // Collision detected
      return true;
    }
  }
  
  // No collision with any object
  return false;
}

function gameLoop() {
  let moveX = 0;
  let moveY = 0;

  // User Input
  if (keyPresses.w) {
    moveY = -MOVEMENT_SPEED;
  } else if (keyPresses.s) {
    moveY = MOVEMENT_SPEED;
  }
  if (keyPresses.a) {
    moveX = -MOVEMENT_SPEED;
  } else if (keyPresses.d) {
    moveX = MOVEMENT_SPEED;
  }
  // User Input

  // Normalize diagonal movement speed
  if (moveX !== 0 && moveY !== 0) {
    moveX *= Math.SQRT1_2;  // Math.SQRT1_2 is equivalent to 1/sqrt(2)
    moveY *= Math.SQRT1_2;
  }

  let newPositionX = positionX + moveX;
  let newPositionY = positionY + moveY;
  
  // Check for collision
  if(!isColliding(newPositionX, positionY)){
    positionX = newPositionX;
  }
  if(!isColliding(positionX, newPositionY)){
    positionY = newPositionY;
  }
  // Check for collision

  // Update Player position to DOM
  player.style.left = positionX + 'px';
  player.style.top = positionY + 'px';

  window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);
