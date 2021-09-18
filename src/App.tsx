import React, { useEffect, useMemo, useRef, useState } from 'react';
import {Board} from './components/board';
import { BoardSize, Cell } from './interfaces';
import { createBoardConfig, revealCells } from './functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';

const boardSize: BoardSize = {
  w: 18,
  h: 10
};

const minesNumber = 20;

function App() {
  const [configuration, setConfiguration] = useState<Cell[][]>(createBoardConfig(boardSize, minesNumber));
  const [gameOver, setGameOver] = useState<boolean>(false);
  const win = useRef<boolean>(false);

  const flags = useMemo(() => {
    let n = 0, cf = 0;
    configuration.forEach(row => {
      row.forEach(col => {
        if(col.flagged) {
          n += 1;
          if(col.type === 'mine') {
            cf += 1;
          }
        }
      });
    });

    if(cf === minesNumber) {
      win.current = true;
    }
    
    return <h2>Found: {n}</h2>;
  }, [configuration]);

  const flagCell = (r: number, c: number) => {
    if(configuration[r][c].show || gameOver) return;

    setConfiguration((prevConfiguration): Cell[][] => {
      return prevConfiguration.map((row, i): Cell[] => {
        return row.map((col: Cell, j): Cell => {
          let flagged = i === r && j === c ? !col.flagged : col.flagged;

          return {...col, flagged}
        })
      });
    });
  };

  useEffect(() => {
    setConfiguration((prevConfiguration): Cell[][] => {
      return prevConfiguration.map((row, i): Cell[] => {
        return row.map((col: Cell, j): Cell => {
          let show = (gameOver && col.type === 'mine') || col.show;
          return {...col, show}
        })
      });
    });
  }, [gameOver])

  const revealCell = (r: number, c: number) => {
    if(gameOver) return;
    if(configuration[r][c].flagged) return;
    if(configuration[r][c].type === 'mine') {
      setGameOver(true);
      return;
    }
    
    setConfiguration((prevConfiguration): Cell[][] => {
      revealCells(prevConfiguration, r, c);
      return prevConfiguration.map((row, i): Cell[] => {
        return row.map((col: Cell, j): Cell => {
          let show = (i === r && j === c) ? true : col.show;
          
          if(gameOver && col.type === 'mine') {
            show = true;
          }
          return {...col, show}
        })
      });
    });
  };

  
  return (
    <div className="container">
      {flags}
      <Board 
        config={configuration} 
        flagCell={(r: number, c: number) => flagCell(r, c)}
        cellReveal={(r: number, c: number) => revealCell(r, c)} 
        size={boardSize}
       />
      <button
        onClick={() => {
          setConfiguration(createBoardConfig(boardSize, minesNumber));
          setGameOver(false);
          win.current = false;
        }} 
        className="btn"
      > 
        <FontAwesomeIcon icon={faRedo}/>
        <span>Restart</span>
      </button>
      {gameOver && <h1>Gameover</h1>}
      {win.current && <h1>Win</h1>}
    </div>
  );
}

export default App;
