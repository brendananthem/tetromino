const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scale = 32;

const boardWidth = 10;
const boardHeight = 20;
const board = Array.from({ length: boardHeight }, () => new Array(boardWidth).fill(null));

let currentTetromino = getRandomTetromino();
let score = 0;
let level = 0;


// Tetromino class definition and other code...

function update() {
  if (!currentTetromino.collides(board, 0, 1)) {
    currentTetromino.move(0, 1);
  } else {
    mergeTetromino(currentTetromino, board);
    const linesCleared = clearFullRows(board);
    updateScore(linesCleared);
    currentTetromino = getRandomTetromino();

    if (currentTetromino.collides(board)) {
      // Game over logic
    }
  }

  draw();
  setTimeout(update, 1000 / (level + 1));
}

// Main game loop
function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();


  
  function getRandomTetromino() {
    const randomIndex = Math.floor(Math.random() * shapes.length);
    return new Tetromino(shapes[randomIndex].shape, shapes[randomIndex].color);
  }

  class Tetromino {
    constructor(shape, color) {
      this.shape = shape;
      this.color = color;
      this.x = Math.floor(canvas.width / scale / 2) - 1;
      this.y = -2;
    }
  
    const shapes = [
      {
        shape: [
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        color: "cyan"
      },
      {
        shape: [
          [1, 1, 1],
          [1, 0, 0],
          [0, 0, 0]
        ],
        color: "blue"
      },
      {
        shape: [
          [1, 1, 1],
          [0, 0, 1],
          [0, 0, 0]
        ],
        color: "orange"
      },
      {
        shape: [
          [1, 1],
          [1, 1]
        ],
        color: "yellow"
      },
      {
        shape: [
          [0, 1, 1],
          [1, 1, 0],
          [0, 0, 0]
        ],
        color: "green"
      },
      {
        shape: [
          [1, 1, 1],
          [0, 1, 0],
          [0, 0, 0]
        ],
        color: "purple"
      },
      {
        shape: [
          [1, 1, 0],
          [0, 1, 1],
          [0, 0, 0]
        ],
        color: "red"
      }
    ];
    


    move(dx, dy) {
      this.x += dx;
      this.y += dy;
    }
  
    rotate() {
      const newShape = this.shape[0].map((_, i) => this.shape.map(row => row[i])).reverse();
      const backupShape = this.shape;
      this.shape = newShape;
  
      if (this.collides(board)) {
        this.shape = backupShape;
      }
    }
  
    collides(board) {
      for (let y = 0; y < this.shape.length; y++) {
        for (let x = 0; x < this.shape[y].length; x++) {
          if (
            this.shape[y][x] &&
            (board[this.y + y] === undefined ||
              board[this.y + y][this.x + x] === undefined ||
              board[this.y + y][this.x + x])
          ) {
            return true;
          }
        }
      }
      return false;
    }
  }
  
  function mergeTetromino(tetromino, board) {
    for (let y = 0; y < tetromino.shape.length; y++) {
      for (let x = 0; x < tetromino.shape[y].length; x++) {
        if (tetromino.shape[y][x]) {
          board[tetromino.y + y][tetromino.x + x] = tetromino.color;
        }
      }
    }
  }

  function clearFullRows(board) {
    let linesCleared = 0;
    outer: for (let y = board.length - 1; y >= 0; y--) {
      for (let x = 0; x < board[y].length; x++) {
        if (!board[y][x]) {
          continue outer;
        }
      }
      linesCleared++;
      board.splice(y, 1);
      board.unshift(new Array(boardWidth).fill(null));
    }
    return linesCleared;
  }


  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        if (!currentTetromino.collides(board, -1, 0)) {
          currentTetromino.move(-1, 0);
        }
        break;
      case 'ArrowRight':
        if (!currentTetromino.collides(board, 1, 0)) {
          currentTetromino.move(1, 0);
        }
        break;
      case 'ArrowDown':
        if (!currentTetromino.collides(board, 0, 1)) {
          currentTetromino.move(0, 1);
        }
        break;
      case 'ArrowUp':
        currentTetromino.rotate();
        break;
    }
  });

  function update() {
    if (!currentTetromino.collides(board, 0, 1)) {
      currentTetromino.move(0, 1);
    } else {
      mergeTetromino(currentTetromino, board);
      const linesCleared = clearFullRows(board);
      updateScore(linesCleared);
      currentTetromino = getRandomTetromino();
  
      if (currentTetromino.collides(board)) {
        // Game over logic
      }
    }
  
    draw();
    setTimeout(update, 1000 / (level + 1));
  }
  
  function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw the game board
    for (let y = 0; y < boardHeight; y++) {
      for (let x = 0; x < boardWidth; x++) {
        if (board[y][x]) {
          ctx.fillStyle = board[y][x];
          ctx.fillRect(x * scale, y * scale, scale, scale);
          ctx.strokeStyle = 'black';
          ctx.strokeRect(x * scale, y * scale, scale, scale);
        }
      }
    }
  
    // Draw the current Tetromino
    ctx.fillStyle = currentTetromino.color;
    for (let y = 0; y < currentTetromino.shape.length; y++) {
      for (let x = 0; x < currentTetromino.shape[y].length; x++) {
        if (currentTetromino.shape[y][x]) {
          ctx.fillRect(
            (currentTetromino.x + x) * scale,
            (currentTetromino.y + y) * scale,
            scale,
            scale
          );
          ctx.strokeStyle = 'black';
          ctx.strokeRect(
            (currentTetromino.x + x) * scale,
            (currentTetromino.y + y) * scale,
            scale,
            scale
          );
        }
      }
    }
  }