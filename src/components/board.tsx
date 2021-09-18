import React from 'react';
import { BoardProps, Cell } from '../interfaces';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBomb, faFlag } from '@fortawesome/free-solid-svg-icons';

const colorMap = new Map<number, string>()
  .set(0, 'transparent')
  .set(1, '#2EC4B6')
  .set(2, '#40515D')
  .set(3, '#e71d36')
  .set(4, 'black')
  .set(5, 'black')
  .set(6, 'black')
  .set(7, 'black')
  .set(8, 'black');

const cellSize = 35;

export const Board: React.FC<BoardProps> = (props) => {
  
  return (
   <div 
    className="board"
    onContextMenu={(e) => e.preventDefault()}
    style={{
      gridTemplateColumns : `repeat(${props.size.w}, 1fr)`,
    }}>
     {
       props.config.map((row: Cell[], r) => {
        return row.map((cell: Cell, c) => {
          const cellClass = classnames({
            cell: true,
            number: cell.type === 'number',
            mine: cell.type === 'mine',
            hidden: !cell.show,
            flagged: cell.flagged
          });
          return (
            <div 
              key={`cell${r}-${c}`} 
              className={cellClass}
              style={
                {
                  color: colorMap.get(cell.value!),
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                }
              }
              onClick={() => props.cellReveal(r, c)} 
              onContextMenu={(e) => { 
                e.preventDefault();
                return props.flagCell(r, c)
              }}
            >
              {cell.flagged && !cell.show && <FontAwesomeIcon icon={faFlag} color="#e71d36"/>}
              {cell.show ? <span>{cell.value}</span> : ''}
              {cell.show && cell.type === 'mine' && <FontAwesomeIcon icon={faBomb} color="#e71d36"/>}
            </div>
          )
        })
       })
     }
   </div>
  );
}