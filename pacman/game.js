const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const gameContainer = document.getElementById('game-container');
const statusText = document.getElementById('status-text');
const speedSlider = document.getElementById('speed-slider');
const speedVal = document.getElementById('speed-val');
const usernameInput = document.getElementById('username');

// Game Constants
const TILE_SIZE = 30;
const ORIGINAL_MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 2, 1, 1, 0, 0, 0, 1, 1, 2, 1, 1, 1],
    [0, 0, 1, 2, 1, 4, 4, 4, 4, 4, 1, 2, 1, 0, 0],
    [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 1, 2, 2, 2, 3, 2, 2, 2, 1, 2, 2, 1],
    [1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let MAP = [];

canvas.width = ORIGINAL_MAP[0].length * TILE_SIZE;
canvas.height = ORIGINAL_MAP.length * TILE_SIZE;

// Game State
let score = 0;
let pelletsLeft = 0;
let gameRunning = false;
let pacmanColor = 'yellow';
let difficulty = 'Medium';
let speedMultiplier = 1.5;
let pacman = null;
let ghosts = [];

function initMap() {
    pelletsLeft = 0;
    ghosts = [];
    MAP = ORIGINAL_MAP.map(row => [...row]);
    
    if (difficulty === 'Easy') {
        for (let y = 0; y < MAP.length; y++) {
            for (let x = 0; x < MAP[y].length; x++) {
                if (MAP[y][x] === 2 && Math.random() < 0.6) MAP[y][x] = 0;
            }
        }
    }

    for (let y = 0; y < MAP.length; y++) {
        for (let x = 0; x < MAP[y].length; x++) {
            if (MAP[y][x] === 2) pelletsLeft++;
            if (MAP[y][x] === 3) {
                pacman = { x, y, pixelX: x * TILE_SIZE, pixelY: y * TILE_SIZE, dir: { x: 0, y: 0 }, nextDir: { x: 0, y: 0 } };
            }
            if (MAP[y][x] === 4) {
                ghosts.push({ x, y, pixelX: x * TILE_SIZE, pixelY: y * TILE_SIZE, dir: { x: 0, y: -1 }, color: 'red' });
            }
        }
    }

    if (difficulty === 'Easy') ghosts = ghosts.slice(0, 1);
    else if (difficulty === 'Medium') ghosts = ghosts.slice(0, 2);
    
    if (ghosts.length > 1) ghosts[1].color = 'pink';
    if (ghosts.length > 2) ghosts[2].color = 'cyan';
    if (ghosts.length > 3) ghosts[3].color = 'orange';
}

// UI Logic
const bestScoreElem = document.getElementById('best-score');
const bestUserElem = document.getElementById('best-user');

function updateBestScoreDisplay() {
    const best = getHighScore();
    bestScoreElem.innerText = best.score;
    bestUserElem.innerText = best.user;
}
updateBestScoreDisplay();

document.querySelectorAll('.color-circle').forEach(circle => {
    circle.addEventListener('click', () => {
        document.querySelector('.color-circle.selected').classList.remove('selected');
        circle.classList.add('selected');
        pacmanColor = circle.dataset.color;
    });
});

speedSlider.addEventListener('input', () => {
    speedVal.innerText = speedSlider.value;
    speedMultiplier = parseFloat(speedSlider.value);
    document.querySelector('.difficulty-btn.selected')?.classList.remove('selected');
});

document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.difficulty-btn.selected')?.classList.remove('selected');
        btn.classList.add('selected');
        difficulty = btn.innerText;
        speedMultiplier = parseFloat(btn.dataset.speed);
        speedSlider.value = speedMultiplier;
        speedVal.innerText = speedMultiplier;
    });
});

document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('restart-button').addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});

function startGame() {
    startScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    score = 0;
    scoreElement.innerText = score;
    initMap();
    gameRunning = true;
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': pacman.nextDir = { x: 0, y: -1 }; break;
        case 'ArrowDown': pacman.nextDir = { x: 0, y: 1 }; break;
        case 'ArrowLeft': pacman.nextDir = { x: -1, y: 0 }; break;
        case 'ArrowRight': pacman.nextDir = { x: 1, y: 0 }; break;
    }
});

function updateEntity(entity, speed) {
    const nextPixelX = entity.pixelX + entity.dir.x * speed;
    const nextPixelY = entity.pixelY + entity.dir.y * speed;

    // Center of the current tile
    const centerX = entity.x * TILE_SIZE;
    const centerY = entity.y * TILE_SIZE;

    // Check if we passed the center of the tile
    const passedCenterX = (entity.pixelX < centerX && nextPixelX >= centerX) || (entity.pixelX > centerX && nextPixelX <= centerX);
    const passedCenterY = (entity.pixelY < centerY && nextPixelY >= centerY) || (entity.pixelY > centerY && nextPixelY <= centerY);

    if (passedCenterX || passedCenterY || (entity.dir.x === 0 && entity.dir.y === 0)) {
        // Snap to center
        entity.pixelX = centerX;
        entity.pixelY = centerY;

        if (entity === pacman) {
            // Try changing to nextDir
            if (MAP[entity.y + entity.nextDir.y] && MAP[entity.y + entity.nextDir.y][entity.x + entity.nextDir.x] !== 1) {
                entity.dir = entity.nextDir;
            }
        } else {
            // Ghost AI: Random turn at intersections or when hitting wall
            const dirs = [{x:0,y:1},{x:0,y:-1},{x:1,y:0},{x:-1,y:0}];
            const validDirs = dirs.filter(d => MAP[entity.y+d.y] && MAP[entity.y+d.y][entity.x+d.x] !== 1);
            if (!MAP[entity.y+entity.dir.y] || MAP[entity.y+entity.dir.y][entity.x+entity.dir.x] === 1 || Math.random() < 0.3) {
                entity.dir = validDirs[Math.floor(Math.random() * validDirs.length)];
            }
        }

        // Stop if hitting wall
        if (MAP[entity.y + entity.dir.y] && MAP[entity.y + entity.dir.y][entity.x + entity.dir.x] === 1) {
            entity.dir = { x: 0, y: 0 };
        } else {
            // Move partially into the next step if we snapped
            const remainingSpeed = speed * 0.5; // Simple approximation
            entity.pixelX += entity.dir.x * remainingSpeed;
            entity.pixelY += entity.dir.y * remainingSpeed;
        }
    } else {
        entity.pixelX = nextPixelX;
        entity.pixelY = nextPixelY;
    }

    // Update grid position
    entity.x = Math.round(entity.pixelX / TILE_SIZE);
    entity.y = Math.round(entity.pixelY / TILE_SIZE);
}

function update(deltaTime) {
    if (!gameRunning) return;

    const baseSpeed = (deltaTime / 16.6) * 2 * speedMultiplier;
    updateEntity(pacman, baseSpeed);

    // Collect Pellets
    if (MAP[pacman.y] && MAP[pacman.y][pacman.x] === 2) {
        MAP[pacman.y][pacman.x] = 0;
        score += 10;
        scoreElement.innerText = score;
        pelletsLeft--;
        if (pelletsLeft === 0) endGame(true);
    }

    ghosts.forEach(ghost => {
        updateEntity(ghost, baseSpeed * 0.7);
        // Collision Detection
        const dist = Math.hypot(pacman.pixelX - ghost.pixelX, pacman.pixelY - ghost.pixelY);
        if (dist < TILE_SIZE * 0.7) {
            endGame(false);
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < MAP.length; y++) {
        for (let x = 0; x < MAP[y].length; x++) {
            if (MAP[y][x] === 1) {
                ctx.fillStyle = '#2222ff';
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (MAP[y][x] === 2) {
                ctx.fillStyle = '#ffb8ae';
                ctx.beginPath();
                ctx.arc(x * TILE_SIZE + TILE_SIZE/2, y * TILE_SIZE + TILE_SIZE/2, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Draw Pac-Man
    ctx.fillStyle = pacmanColor;
    ctx.beginPath();
    const mouthAngle = (Math.sin(Date.now() / 100) + 1) * 0.2;
    let rotation = 0;
    if (pacman.dir.x === 1) rotation = 0;
    else if (pacman.dir.x === -1) rotation = Math.PI;
    else if (pacman.dir.y === 1) rotation = Math.PI/2;
    else if (pacman.dir.y === -1) rotation = -Math.PI/2;

    ctx.arc(pacman.pixelX + TILE_SIZE/2, pacman.pixelY + TILE_SIZE/2, TILE_SIZE/2 - 2, rotation + mouthAngle, rotation + 2*Math.PI - mouthAngle);
    ctx.lineTo(pacman.pixelX + TILE_SIZE/2, pacman.pixelY + TILE_SIZE/2);
    ctx.fill();

    // Draw Ghosts
    ghosts.forEach(ghost => {
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(ghost.pixelX + TILE_SIZE/2, ghost.pixelY + TILE_SIZE/2, TILE_SIZE/2 - 2, Math.PI, 0);
        ctx.lineTo(ghost.pixelX + TILE_SIZE - 2, ghost.pixelY + TILE_SIZE);
        ctx.lineTo(ghost.pixelX + 2, ghost.pixelY + TILE_SIZE);
        ctx.fill();
    });
}

let lastTime = 0;
function gameLoop(timestamp) {
    if (!gameRunning) return;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();
    requestAnimationFrame(gameLoop);
}

function endGame(win) {
    gameRunning = false;
    gameContainer.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    statusText.innerText = win ? "YOU WIN!" : "GAME OVER";
    statusText.style.color = win ? "#00ff00" : "#ff0000";
    finalScoreElement.innerText = score;

    saveScore(score);
}

function saveScore(score) {
    const username = usernameInput.value || 'Anonymous';
    const highScore = localStorage.getItem('pacman_highScore') || 0;
    
    if (score > highScore) {
        localStorage.setItem('pacman_highScore', score);
        localStorage.setItem('pacman_highScore_user', username);
        alert(`New High Score: ${score}!`);
    }
}

// Function to get high score for display
function getHighScore() {
    return {
        score: localStorage.getItem('pacman_highScore') || 0,
        user: localStorage.getItem('pacman_highScore_user') || 'None'
    };
}
