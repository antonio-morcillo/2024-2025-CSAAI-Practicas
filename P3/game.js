const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let shipX = canvas.width / 2 - 25;
const shipWidth = 50;
const shipHeight = 30;
const shipSpeed = 6;
let bullets = [];
let aliens = [];
let alienDirection = 1;
let alienSpeed = 1;
let score = 0;
let gameOver = false;
let explosionFrames = {};
let canShoot = true;

const alienImg = new Image();
const naveImg = new Image();
const explosionImg = new Image();
explosionImg.src = "efectos/explosion.png";
naveImg.src = "efectos/nave.png";
alienImg.src = "efectos/alien.png";

const laserSound = new Audio("efectos/laser.mp3");
const explosionSound = new Audio("efectos/explosion.mp3");
const victorySound = new Audio("efectos/victory.mp3");
const defeatSound = new Audio("efectos/defeat.mp3");

let leftPressed = false;
let rightPressed = false;

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") leftPressed = true;
  if (e.code === "ArrowRight") rightPressed = true;
  if (e.code === "Space") shoot();
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft") leftPressed = false;
  if (e.code === "ArrowRight") rightPressed = false;
});

function shoot() {
  if (!canShoot) return;
  bullets.push({ x: shipX + shipWidth / 2, y: canvas.height - shipHeight });
  laserSound.currentTime = 0;
  laserSound.play();
  canShoot = false;
  setTimeout(() => canShoot = true, 150);
}

function createAliens() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      aliens.push({ x: 80 + col * 80, y: 50 + row * 60, alive: true });
    }
  }
}

function drawShip() {
  ctx.fillStyle = "white";
  ctx.drawImage(naveImg, shipX, canvas.height - shipHeight, shipWidth, shipHeight);
}

function drawBullets() {
  ctx.fillStyle = "red";
  bullets = bullets.filter(b => b.y > 0);
  bullets.forEach((b) => {
    b.y -= 10;
    ctx.fillRect(b.x - 2, b.y, 4, 10);
  });
}

function drawAliens() {
  let edgeHit = false;
  aliens.forEach((alien) => {
    if (alien.alive) {
      alien.x += alienDirection * alienSpeed;
      if (alien.x < 0 || alien.x > canvas.width - 40) edgeHit = true;
      ctx.fillStyle = "lime";
      ctx.drawImage(alienImg, alien.x, alien.y, 40, 30);
    }
  });
  if (edgeHit) {
    alienDirection *= -1;
    aliens.forEach((a) => { a.y += 20; });
    alienSpeed += 0.2;
  }
}

function drawExplosions() {
  for (let key in explosionFrames) {
    let frame = explosionFrames[key];
    if (frame.type === "img") {
      ctx.drawImage(explosionImg, frame.x, frame.y, 40, 30);
    } else {
      ctx.fillStyle = "orange";
      ctx.beginPath();
      ctx.arc(frame.x + 20, frame.y + 15, 20, 0, Math.PI * 2);
      ctx.fill();
    }
    frame.frames--;
    if (frame.frames <= 0) delete explosionFrames[key];
  }
}


function detectCollisions() {
  bullets.forEach((b) => {
    aliens.forEach((a, i) => {
      if (a.alive && b.x > a.x && b.x < a.x + 40 && b.y < a.y + 30 && b.y > a.y) {
        a.alive = false;
        explosionSound.currentTime = 0;
        explosionSound.play();
        explosionFrames[i] = { x: a.x, y: a.y, frames: 15, type: "img" };
        b.y = -10;
        score += 10;
      }
    });
  });
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Puntos: ${score}`, 10, 25);
}

function checkGameOver() {
  if (aliens.some(a => a.alive && a.y + 30 >= canvas.height - shipHeight)) {
    endGame(false);
  }
  if (!aliens.some(a => a.alive)) {
    endGame(true);
  }
}

function endGame(victory) {
  gameOver = true;
  document.getElementById("overlay").classList.remove("hidden");
  document.getElementById("endMessage").textContent = victory ? "¡Victoria! ¡Vaya punteria!" : "GAME OVER";
  (victory ? victorySound : defeatSound).play();
}

function update() {
  if (gameOver) return;
  if (leftPressed && shipX > 0) shipX -= shipSpeed;
  if (rightPressed && shipX + shipWidth < canvas.width) shipX += shipSpeed;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawShip();
  drawBullets();
  drawAliens();
  drawExplosions();
  detectCollisions();
  drawScore();
  checkGameOver();

  requestAnimationFrame(update);
}

createAliens();
update();