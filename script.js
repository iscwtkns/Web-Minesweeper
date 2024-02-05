class Tile {
    isBomb;
    revealed;
    isFlagged

    constructor(isBomb) {
        this.isBomb = isBomb;
        this.revealed = false;
        this.isFlagged = false;
    }
}
const squares = document.querySelectorAll(".square");
const game = document.querySelector(".board");
let board = initialiseTiles();
squares.forEach(function(square, index) {
    square.addEventListener("click", (e) => {
        const tile = board[Math.floor(index / 10)][index % 10];
        if (tile.revealed) {
            if (bombsNextTo(tile) === flagsNextTo(tile)) {
                revealSurrounding(tile);
            }
        }
        if (!tile.revealed && !tile.isFlagged) {
            revealTiles(tile);
            console.log(board);
        }

        updateSquares();
    })
    square.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        console.log("right click");
        const tile = board[Math.floor(index / 10)][index % 10];
        if (!tile.revealed) {
            tile.isFlagged = !tile.isFlagged;
            updateSquares();

        }
    })
})

function revealSurrounding(tile) {
    let tiles = tilesNextTo(tile);
    for (let i = 0; i < tiles.length; i++) {
        if (!tiles[i].isFlagged) {
            revealTiles(tiles[i]);
        }
    }
}
function resetGame() {
    board = initialiseTiles();
    updateSquares();
}
function initialiseTiles() {
    let tiles = [];
    let bombIndices = [];
    for (let i = 0; i < 13; i++) {
        let random = Math.floor(Math.random()*100);
        while (bombIndices.includes(random)) {
            random = Math.floor(Math.random()*100);
        }
        bombIndices.push(random);
    }
    squares.forEach(function(square, index) {
        square.className = "square";
        if (index % 10 === 0) {
            tiles.push([]);
        }
        tiles[Math.floor(index / 10)].push(new Tile(bombIndices.includes(index)));
    })
    return tiles;
}
function updateSquares() {
    squares.forEach(function(square, index) {
        removeAllChildNodes(square);
        let tile = board[Math.floor(index / 10)][index % 10];
        if (tile.isFlagged) {
            let flag = document.createElement("img");
            flag.src = "flag.png";
            flag.className = "flag";
            square.appendChild(flag);
        }
        if (tile.revealed) {
            if (tile.isBomb) {
                square.className = "mineTile";
                let mine = document.createElement("img");
                mine.src = "mine.png";
                mine.className = "mine";
                square.appendChild(mine);
            }
            else {
                square.className = "revealed";
                if (bombsNextTo(tile) !== 0) {
                    square.textContent = bombsNextTo(tile).toString();
                }
            }
        }
    })
}
function flagsNextTo(tile) {
    let pos = findPos(tile);
    let flagCount = 0;
    for (let i = -1; i < 2; i++) {
        if (isValidPos(pos[0]+i)) {
            for (let j = -1; j < 2; j++) {
                if (isValidPos(pos[1]+j)) {
                    if (board[pos[0]+i][pos[1]+j].isFlagged) {
                        flagCount += 1;
                    }
                }
            }
        }
    }
    return flagCount;
}
function tilesNextTo(tile) {
    let pos = findPos(tile);
    let tiles = [];
    for (let i = -1; i < 2; i++) {
        if (isValidPos(pos[0]+i)) {
            for (let j = -1; j < 2; j++) {
                if (isValidPos(pos[1]+j)) {
                    const tileHere = board[pos[0]+i][pos[1]+j];
                    if (tile !== tileHere) {
                        tiles.push(tileHere);
                    }
                }
            }
        }
    }
    return tiles;
}
function bombsNextTo(tile) {
    let pos = findPos(tile);
    let bombCount = 0;
    for (let i = -1; i < 2; i++) {
        if (isValidPos(pos[0]+i)) {
            for (let j = -1; j < 2; j++) {
                if (isValidPos(pos[1]+j)) {
                    if (board[pos[0]+i][pos[1]+j].isBomb) {
                        bombCount += 1;
                    }
                }
            }
        }
    }
    if (tile.isBomb) {
        bombCount -= 1;
    }
    return bombCount;
}
function findPos(tile) {
    let pos = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === tile) {
                pos = [i, j];
            }
        }
    }
    return pos;
}
function isValidPos(number) {
    return !(number < 0 || number > 9);

}
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
function revealTiles(parentTile) {
    const pos = findPos(parentTile);
    console.log("revealing tile");
    parentTile.revealed = true;
    if (bombsNextTo(parentTile) === 0) {
        const adjacentTiles = tilesNextTo(parentTile);
        console.log(adjacentTiles);
        for (let i = 0; i < adjacentTiles.length; i++) {
            if (!adjacentTiles[i].revealed) {
                revealTiles(adjacentTiles[i]);
            }
        }
    }
}