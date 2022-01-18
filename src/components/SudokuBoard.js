import React from 'react';
import { getClassNames } from '../utils/styleUtils';
import { isNotNullOrUndefined, isNotEmpty } from '../utils/utils';
import '../styles/Sudoku.css';

const SudokuBoard = ({
  cells,
  selectedCell,
  handleSudokuCellClick,
  collisions,
  selectedBox,
}) => {
  const renderSudokuCell = (rowIndex, cellIndex) => {
    const classNames = getClassNames({
      cells,
      selectedCell,
      rowIndex,
      cellIndex,
      selectedBox,
      collisions,
    });
    const [selectRowIndex, selectColIndex] = selectedCell;
    const bigNum = cells[rowIndex][cellIndex]?.bigNum;
    const smallNums = cells[rowIndex][cellIndex]?.smallNums;
    const cellColor = cells[rowIndex][cellIndex]?.color;
    const backgroundColorStyle = cellColor
      ? { backgroundColor: cellColor }
      : {};

    let currentSelectBigNum;
    if (
      isNotNullOrUndefined(selectRowIndex) &&
      isNotNullOrUndefined(selectColIndex)
    ) {
      currentSelectBigNum = cells[selectRowIndex][selectColIndex]?.bigNum;
    }

    return (
      <div
        key={`sudoku-cell-${rowIndex}-${cellIndex}-big:${bigNum}`}
        className={`cell ${classNames.join(' ')}`}
        onClick={() => handleSudokuCellClick(rowIndex, cellIndex)}
        style={backgroundColorStyle}
      >
        {isNotNullOrUndefined(bigNum) ? (
          bigNum
        ) : (
          <>
            {isNotEmpty(smallNums) && (
              <div className="smallNums">
                {smallNums.map((num) => (
                  <div
                    key={`sudoku-cell-${rowIndex}-${cellIndex}-small:${num}`}
                    className={`smallNum
                      ${num === currentSelectBigNum ? ' highlightSmallNum' : ''}
                    `}
                  >
                    {num}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderSudokuBoard = () =>
    cells.map((row, rowIndex) => (
      <div key={`sudoku-row-${rowIndex}`} className="row">
        {row.map((cell, cellIndex) => renderSudokuCell(rowIndex, cellIndex))}
      </div>
    ));

  return <div className="sudoku">{renderSudokuBoard()}</div>;
};

export default SudokuBoard;
