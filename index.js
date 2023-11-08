// Definitely needs to be refactored later!
// Solve function doesn't really 'solve' the puzzle, it just plays the moves made in reverse order.
// Clicking buttons again before the shuffle or solve process is finished will break things.

let cols = 8;
let rows = cols;
let ww = 400;
let hh = ww;
let tiles = [];
let tileSize;
let blank;
let lastPickedIndex;
let source;
let timeoutsArray = [];
let timeoutsSolveArray = [];
let timeoutDelay = 60;
let debug = false;
let shuffleCount = cols * cols * 2;
let recordingArr = [];
let gameStarted = false;

function preload() {
  source = loadImage("photo-1549740425-5e9ed4d8cd34.avif");
}

function setup() {
  createCanvas(ww, hh);
  tileSize = floor(ww / cols);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let x = i * tileSize;
      let y = j * tileSize;
      let img = createImage(tileSize, tileSize);
      img.copy(source, x, y, tileSize, tileSize, 0, 0, tileSize, tileSize);
      let index = i + j * cols;
      let tile = new Tile(x, y, index, img);
      tiles.push(tile);
    }
  }
  blank = tiles[tiles.length - 1];
  blank.isBlank = true;

  let myDiv = createDiv().addClass("buttons");
  let btn1 = createButton(`Shuffle (${shuffleCount} random moves)`).parent(
    myDiv
  );
  let btn4 = createButton('Stop Shuffle').parent(myDiv);
  let btn2 = createButton("Solve").parent(myDiv);
  let btn3 = createButton("Undo").parent(myDiv);
  btn1.mousePressed(() => {
    shuffleArray(shuffleCount);
  });
  btn2.mousePressed(() => {
    solveArray();
    recordingArr.length = 0;
  });
  btn3.mousePressed(undoOneMove);
  btn4.mousePressed(() => {
    for (let i = 0; i < timeoutsArray.length; i++) {
      clearTimeout(timeoutsArray[i]);
    }
  });
}

function mouseClicked() {
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].clicked(mouseX, mouseY);
  }
}

const findMovableTiles = () => {
  return tiles.filter((t) => {
    return (
      (t.x == blank.x || t.y == blank.y) &&
      t != blank &&
      t.index != lastPickedIndex &&
      ((blank.cI % cols > 0 && t.cI == blank.cI - 1) ||
        (blank.cI % cols < cols - 1 && t.cI == blank.cI + 1) ||
        (blank.cI > cols - 1 && t.cI == blank.cI - cols) ||
        (blank.cI < tiles.length - cols && t.cI == blank.cI + cols))
    );
  });
};

const shuffleArray = (count) => {
  for (let i = 0; i < count; i++) {
    timeoutsArray[i] = setTimeout(() => {
      let validTiles = findMovableTiles();
      let picked = random(validTiles);
      // console.log(picked.index);
      lastPickedIndex = picked.index;
      picked.clicked(picked.x + 1, picked.y + 1);
    }, timeoutDelay * i);
  }
};

function undoOneMove() {
  let m = recordingArr.pop();
  m.clicked(m.x + 1, m.y + 1, false);
}

function solveArray() {
  let tmp = Array.from(recordingArr);
  tmp.reverse();
  for (let i = 0; i < tmp.length; i++) {
    timeoutsSolveArray[i] = setTimeout(() => {
      tmp[i].clicked(tmp[i].x + 1, tmp[i].y + 1, false);
    }, timeoutDelay * i);
  }
}

function draw() {
  background(200);
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].show();
    tiles[i].move();
  }

  if (debug) {
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        let x = i * tileSize;
        let y = j * tileSize;
        let index = i + j * cols;
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        text(`${index}`, x + tileSize / 2, y + tileSize / 2);
      }
    }
  }
  if (tiles.every((t) => t.cI == t.index) && gameStarted) {
    console.log("SOLVED!");
    recordingArr = [];
    gameStarted = false;
  }
}
