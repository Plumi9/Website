let player = document.getElementById('player');

const MOVEMENT_SPEED = 10;
let positionX = 20;
let positionY = 20;
let keyPresses = {};

window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
    keyPresses[event.key] = true;
}

window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
    keyPresses[event.key] = false;
}

function gameLoop() {
  let moveX = 0;
  let moveY = 0;

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

  // Normalize diagonal movement speed
  if (moveX !== 0 && moveY !== 0) {
    moveX *= Math.SQRT1_2;  // Math.SQRT1_2 is equivalent to 1/sqrt(2)
    moveY *= Math.SQRT1_2;
  }

  positionX += moveX;
  positionY += moveY;

  player.style.left = positionX + 'px';
  player.style.top = positionY + 'px';

  window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);
