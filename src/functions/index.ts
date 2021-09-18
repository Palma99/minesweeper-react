import {
  BoardSize, Cell, Coords
} from "../interfaces";

const getRandomNumber = (max: number) => Math.floor(Math.random() * max);


const addMines = (minesNumber: number, size: BoardSize) => {
  let minesCoords = new Array<Coords>();

  while(minesCoords.length !== minesNumber) {
    const coord: Coords = {
      x: getRandomNumber(size.w),
      y: getRandomNumber(size.h)
    }
    

    if(!checkConflict(minesCoords, coord)) {
      minesCoords.push(coord);
    }
  }

  return minesCoords;
};

const checkConflict = (arr: Coords[], coord: Coords) => {
  let conflict = false;

  for(const row of arr) {
    if(row.x === coord.x && row.y === coord.y) {
      conflict = true;
      break;
    }
  }

  return conflict;
}

export const createBoardConfig = (size: BoardSize, mines: number): Cell[][] => {

  let config: Cell[][] = new Array<Array<Cell>>();
  const minesCoords = addMines(mines, size);
  
  for (let i: number = 0; i < size.h; i++) {
    let row: Cell[] = new Array<Cell>();
    for (let j: number = 0; j < size.w; j++) {
      row.push(checkConflict(minesCoords, {x: j, y: i}) ? {type: 'mine'} : {type: 'number', value: 0});
    }
    config.push(row);
  }

  for (let i: number = 0; i < size.h; i++) {
    for (let j: number = 0; j < size.w; j++) {
      if(config[i][j].type === 'mine') {
        for(let r: number = -1; r <= 1; r++) {
          for(let c: number = -1; c <= 1; c++) {
            let yOffset = i + r;
            let xOffset = j + c;

            if(yOffset >= 0 && yOffset < size.h && xOffset >= 0 && xOffset < size.w) {
              if(config[yOffset][xOffset].type === 'number') {
                config[yOffset][xOffset].value! += 1;
              }
            }
          }
        }
      }
    }
  }
  
  return config;
};


export const revealCells = (config: Cell[][], r: number, c: number) => {

  if(config[r][c].show) return;
  if(config[r][c].type === 'mine' || config[r][c].flagged) return;

  if(config[r][c].type === 'number') {
    config[r][c].show = true;
    if(config[r][c].value === 0) {
      
      for(let i: number = -1; i <= 1; i++) {
        for(let j: number = -1; j <= 1; j++) {
          let yOffset = i + r;
          let xOffset = j + c;

          if(yOffset >= 0 && yOffset < config.length && xOffset >= 0 && xOffset < config[0].length) {
            revealCells(config, yOffset, xOffset);
          }
        }
      }
    } else {
      return;
    }
  }

};


