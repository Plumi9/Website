let player = document.getElementById('player');
let rock = document.getElementById('rock');
let rock_round = document.getElementById('rock_round');

let arrow_up = document.getElementById('arrow_up');
let pressed_arrow_up = document.getElementById('pressed_arrow_up');
let arrow_down = document.getElementById('arrow_down');
let pressed_arrow_down = document.getElementById('pressed_arrow_down');
let arrow_left = document.getElementById('arrow_left');
let pressed_arrow_left = document.getElementById('pressed_arrow_left');
let arrow_right = document.getElementById('arrow_right');
let pressed_arrow_right = document.getElementById('pressed_arrow_right');

let LIST_OF_OBJECTS = [rock, rock_round, 
                      arrow_up, pressed_arrow_up, arrow_down, pressed_arrow_down, arrow_left, pressed_arrow_left, arrow_right, pressed_arrow_right];

let objectPositions = LIST_OF_OBJECTS.map(object => object.getBoundingClientRect());

const MOVEMENT_SPEED = 10;
let positionX = 400;
let positionY = 400;
let keyPresses = {};

window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
  keyPresses[event.key] = true;
}

window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
  keyPresses[event.key] = false;
  switch(event.key) {
    case 'w':
      pressed_arrow_up.setAttribute("hidden", "hidden");
      break;
    case 's':
      pressed_arrow_down.setAttribute("hidden", "hidden");
      break;
    case 'a':
      pressed_arrow_left.setAttribute("hidden", "hidden");
      break;
    case 'd':
      pressed_arrow_right.setAttribute("hidden", "hidden");
      break;
  }
}

function isColliding(newPositionX, newPositionY) {
  let player_Position = {
    left: newPositionX,
    right: newPositionX + player.offsetWidth,
    top: newPositionY,
    bottom: newPositionY + player.offsetHeight,
  };

  // Check all objects for collision
  for (let objectPosition of objectPositions) {
    if (!(player_Position.top > objectPosition.bottom || 
          player_Position.bottom < objectPosition.top ||
          player_Position.left > objectPosition.right ||
          player_Position.right < objectPosition.left)) {
      // Collision detected
      return true;
    }
  }

  // No collision with any object
  return false;
}

let has_scrolled = false;
let isScrolling = false;
let scroll_counter = 1;
function pageScroll() {
  const targetScrollY = 1240 * scroll_counter; // The target scroll position
  const scrollStep = 20; // How many pixels to scroll per frame
  const duration = 2000; // Duration of the scroll in milliseconds
  const totalSteps = duration / 16; // Total frames (approx. 60 FPS)
  let currentStep = 0;
  
  if (!has_scrolled) {
    has_scrolled = true; // Ensure this runs only once per scroll action
    
    const scrollInterval = setInterval(() => {
      const currentScrollY = window.scrollY;
      
      // Stop if we've reached or exceeded the target scroll position
      if (currentScrollY >= targetScrollY) {
        clearInterval(scrollInterval);
        window.scrollTo(0, targetScrollY); // Ensure we snap to the target
        return; // Exit the function
      }

      window.scrollBy(0, scrollStep);
      currentStep++;
      
      // Stop if we reach the maximum number of steps
      if (currentStep >= totalSteps) {
        clearInterval(scrollInterval);
        window.scrollTo(0, targetScrollY); // Snap to the target
      }
    }, 16); // Approximately 60 FPS

    teleport_Player_to_newPositionY(targetScrollY);
    scroll_counter += 1;

    // Reset `has_scrolled` after the scroll completes (duration of 2 seconds)
    setTimeout(() => {
      has_scrolled = false; // Reset the scroll lock
    }, duration); // Matches the scroll animation duration
  }
}

function teleport_Player_to_newPositionY(newPositionY){
  positionY = newPositionY;
}

function check_Position_to_scroll() {
  if (!isScrolling && positionY >= window.innerHeight + window.scrollY) {
    console.log("HELLO");
    isScrolling = true; // Disable further checks during scroll
    pageScroll();
    setTimeout(() => { 
      isScrolling = false; // Re-enable scroll check after 2 seconds
    }, 1000); 
  }
}

function gameLoop() {
  let moveX = 0;
  let moveY = 0;

  // User Input
  if (keyPresses.w) {
    moveY = -MOVEMENT_SPEED;
    pressed_arrow_up.removeAttribute("hidden");
  } 
  if (keyPresses.s) {
    moveY = MOVEMENT_SPEED;
    pressed_arrow_down.removeAttribute("hidden");
  }
  if (keyPresses.a) {
    moveX = -MOVEMENT_SPEED;
    pressed_arrow_left.removeAttribute("hidden");
  } 
  if (keyPresses.d) {
    moveX = MOVEMENT_SPEED;
    pressed_arrow_right.removeAttribute("hidden");
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

  check_Position_to_scroll();

  window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);