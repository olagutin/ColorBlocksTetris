class Tetris {
  constructor(image, template) {
    this.image = image;
    this.template = template;
    this.x = squareCountX / 2;
    this.y = 0;
  }

  checkBottom() {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] == 0) continue;
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        if (realY + 1 >= squareCountY) {
          return false;
        }
        if (gameMap[realY + 1][realX].image != -1) return false;
      }
    }
    return true;
  }

  getTruncedPosition() {
    return { x: Math.trunc(this.x), y: Math.trunc(this.y) };
  }

  checkLeft() {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] == 0) continue;
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        if (realX - 1 < 0) {
          return false;
        }
        if (gameMap[realY][realX - 1].image != -1) return false;
      }
    }
    return true;
  }

  checkRight() {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] == 0) continue;
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        if (realX + 1 >= squareCountX) {
          return false;
        }
        if (gameMap[realY][realX + 1].image != -1) return false;
      }
    }
    return true;
  }

  moveRight() {
    if (this.checkRight()) {
      this.x += 1;
    }
  }

  moveLeft() {
    if (this.checkLeft()) {
      this.x -= 1;
    }
  }

  moveBottom() {
    if (this.checkBottom()) {
      this.y += 1;
      score += 1;
    }
  }

  changeRotation() {
    let tmpTemplate = [];
    for (let i = 0; i < this.template.length; i++)
      tmpTemplate[i] = this.template[i].slice();
    let n = this.template.length;
    for (let layer = 0; layer < n / 2; layer++) {
      let first = layer;
      let last = n - 1 - layer;
      for (let i = first; i < last; i++) {
        let offset = i - first;
        let top = this.template[first][i];
        this.template[first][i] = this.template[i][last]; //top = right
        this.template[i][last] = this.template[last][last - offset]; // right = bottom
        this.template[last][last - offset] =
          this.template[last - offset][first]; //bottom = left
        this.template[last - offset][first] = top;
      }
    }

    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] == 0) continue;
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        if (
          realX < 0 ||
          realX >= squareCountX ||
          realY < 0 ||
          realY >= squareCountY
        ) {
          this.template = tmpTemplate;
          return false;
        }
        if (gameMap[realY][realX - 1].image != -1) return false;
      }
    }
  }
}

const imageSquareSize = 24;
const size = 40;
const framePerSecond = 24;
const gameSpeed = 5;
const canvas = document.getElementById("canvas");
const nextShapeCanvas = document.getElementById("nextShapeCanvas");
const scoreCanvas = document.getElementById("scoreCanvas");
const red = document.getElementById("1");
const blue = document.getElementById("2");
const violet = document.getElementById("3");
const green = document.getElementById("4");
const yellow = document.getElementById("5");
const orange = document.getElementById("6");
const pink = document.getElementById("7");

const ctx = canvas.getContext("2d");
const nctx = nextShapeCanvas.getContext("2d");
const sctx = scoreCanvas.getContext("2d");
const squareCountX = canvas.width / size;
const squareCountY = canvas.height / size;

const shapes = [
  new Tetris(red, [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ]),
  new Tetris(blue, [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]),
  new Tetris(green, [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ]),
  new Tetris(yellow, [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
  ]),
  new Tetris(violet, [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ]),
  new Tetris(orange, [
    [1, 1],
    [1, 1],
  ]),
  new Tetris(pink, [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ]),
];

let gameMap;
let gameOver;
let currentShape;
let nextShape;
let score;
let initialTwoDArr;
let whiteLineThickness = 4;

let gameLoop = () => {
  setInterval(update, 1500 / gameSpeed);
  setInterval(draw, 1000 / framePerSecond);
};

let deleteCompleteRows = () => {
  for (let i = 0; i < gameMap.length; i++) {
    let t = gameMap[i];
    let isComplite = true;
    for (const element of t) {
      if (element.image == -1) isComplite = false;
    }
    if (isComplite) {
      score += 1000;
      console.log("completeRow");
      for (let k = i; k > 0; k--) {
        gameMap[k] = gameMap[k - 1];
      }
      let temp = [];
      for (let j = 0; j < squareCountX; j++) {
        temp.push({ image: -1 });
      }
      gameMap[0] = temp;
    }
  }
};

let update = () => {
  if (gameOver) return;
  if (currentShape.checkBottom()) {
    currentShape.y += 1;
  } else {
    for (let k = 0; k < currentShape.template.length; k++) {
      for (let l = 0; l < currentShape.template.length; l++) {
        if (currentShape.template[k][l] == 0) continue;
        gameMap[currentShape.getTruncedPosition().y + l][
          currentShape.getTruncedPosition().x + k
        ] = { image: currentShape.image };
      }
    }
    deleteCompleteRows();
    currentShape = nextShape;
    nextShape = getRandomShape();
    if (!currentShape.checkBottom()) {
      gameOver = true;
    }
    score += 100;
  }
};

let drawRect = (x, y, width, height, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
};

let drawBackground = () => {
  drawRect(0, 0, canvas.width, canvas.height, "#dbd9d9");
  for (let i = 0; i < squareCountX; i++) {
    drawRect(
      size * i - whiteLineThickness,
      0,
      whiteLineThickness,
      canvas.height,
      "white"
    );
  }

  for (let i = 0; i < squareCountY; i++) {
    drawRect(
      0,
      size * i - whiteLineThickness,
      canvas.width,
      whiteLineThickness,
      "white"
    );
  }
};

let drawCurrentTetris = () => {
  for (let i = 0; i < currentShape.template.length; i++) {
    for (let j = 0; j < currentShape.template.length; j++) {
      if (currentShape.template[i][j] == 0) continue;
      ctx.drawImage(
        currentShape.image,
        0,
        0,
        imageSquareSize,
        imageSquareSize,
        Math.trunc(currentShape.x) * size - 2 + size * i,
        Math.trunc(currentShape.y) * size - 2 + size * j,
        size,
        size
      );
    }
  }
};

let drawNextShape = () => {
  nctx.fillStyle = "#dbd9d9";
  nctx.fillRect(0, 0, nextShapeCanvas.width, nextShapeCanvas.height);
  for (let i = 0; i < nextShape.template.length; i++) {
    for (let j = 0; j < nextShape.template.length; j++) {
      if (nextShape.template[i][j] == 0) continue;
      nctx.drawImage(
        nextShape.image,
        0,
        0,
        imageSquareSize,
        imageSquareSize,
        i * size,
        j * size + size,
        size,
        size
      );
    }
  }
};

let drawSquares = () => {
  for (let i = 0; i < gameMap.length; i++) {
    let t = gameMap[i];
    for (let j = 0; j < t.length; j++) {
      if (t[j].image == -1) continue;
      ctx.drawImage(
        t[j].image,
        0,
        0,
        imageSquareSize,
        imageSquareSize,
        j * size - 2,
        i * size - 2,
        size,
        size
      );
    }
  }
};

let drawScore = () => {
  sctx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
  sctx.font = "64px helvetica";
  sctx.fillStyle = "black";
  sctx.fillText(score, 10, 50);
};

let drawGameOver = () => {
  ctx.font = "64px helvetica";
  ctx.fillStyle = "black";
  ctx.fillText("Game Over!", 12, canvas.height / 2);
};

let draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawSquares();
  drawCurrentTetris();
  drawNextShape();
  drawScore();
  if (gameOver) {
    drawGameOver();
  }
};

let getRandomShape = () => {
  return Object.create(shapes[Math.floor(Math.random() * shapes.length)]);
};

let resetVars = () => {
  initialTwoDArr = [];
  for (let i = 0; i < squareCountY; i++) {
    let tmp = [];
    for (let j = 0; j < squareCountX; j++) {
      tmp.push({ image: -1 });
    }
    initialTwoDArr.push(tmp);
  }
  score = 0;
  gameOver = false;
  currentShape = getRandomShape();
  nextShape = getRandomShape();
  gameMap = initialTwoDArr;
};

window.addEventListener("keydown", (event) => {
  if (event.keyCode == 37) currentShape.moveLeft();
  else if (event.keyCode == 38) currentShape.changeRotation();
  else if (event.keyCode == 39) currentShape.moveRight();
  else if (event.keyCode == 40) currentShape.moveBottom();
});

resetVars();
gameLoop();
