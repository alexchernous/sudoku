import React from 'react';
import './styles/App.css';
import SudokuBoard from './components/SudokuBoard';
import Controls from './components/Controls';
import { useEventListener } from './hooks/eventListener';
import { useLocalStorage } from './hooks/storage';
import { getCollisions, getCurrentBox } from './utils/boardUtils';
import { isNotNullOrUndefined, isNotEmpty } from './utils/utils';
import * as text from './text/text';

const App = () => {
  const [cells, setCells] = useLocalStorage(
    'sudoku:board',
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null))
  );
  const [selectedCell, setSelectedCell] = React.useState([null, null]);
  const selectedBox = selectedCell ? getCurrentBox(selectedCell) : null;
  const [collisions, setCollisions] = React.useState([]);
  const [smallNumsOn, setSmallNumsOn] = React.useState(false);

  const globalKeyHandler = ({ key }) => {
    const number = Number(key);
    if (number && number > 0 && number < 10) {
      handleInput(number);
    } else if (key === 'CapsLock') {
      setSmallNumsOn((smallNumsOn) => !smallNumsOn);
    } else if (key === 'Backspace') {
      handleEraseClick();
    } else if (key === 'ArrowLeft') {
      const [selectRowIndex, selectCellIndex] = selectedCell;
      const newCellIndex =
        selectCellIndex - 1 >= 0 ? selectCellIndex - 1 : selectCellIndex;
      handleSudokuCellClick(selectRowIndex, newCellIndex);
    } else if (key === 'ArrowRight') {
      const [selectRowIndex, selectCellIndex] = selectedCell;
      const newCellIndex =
        selectCellIndex + 1 <= 8 ? selectCellIndex + 1 : selectCellIndex;
      handleSudokuCellClick(selectRowIndex, newCellIndex);
    } else if (key === 'ArrowUp') {
      const [selectRowIndex, selectCellIndex] = selectedCell;
      const newCellIndex =
        selectRowIndex - 1 >= 0 ? selectRowIndex - 1 : selectRowIndex;
      handleSudokuCellClick(newCellIndex, selectCellIndex);
    } else if (key === 'ArrowDown') {
      const [selectRowIndex, selectCellIndex] = selectedCell;
      const newCellIndex =
        selectRowIndex + 1 <= 8 ? selectRowIndex + 1 : selectRowIndex;
      handleSudokuCellClick(newCellIndex, selectCellIndex);
    }
  };

  useEventListener('keydown', globalKeyHandler);

  const handleSudokuCellClick = (rowIndex, cellIndex) => {
    setSelectedCell([rowIndex, cellIndex]);
    setCollisions([]);
  };

  const handleColorChange = (rowIndex, cellIndex, color) => {
    const cellsCopy = [...cells];
    const cell = cellsCopy[rowIndex][cellIndex];
    if (cell) {
      cellsCopy[rowIndex][cellIndex].color = color;
    } else {
      cellsCopy[rowIndex][cellIndex] = { color };
    }
    setCells(cellsCopy);
  };

  const handleInput = (input) => {
    const [rowIndex, cellIndex] = selectedCell;

    // TODO: improve these condition chains
    if (isNotNullOrUndefined(rowIndex) && isNotNullOrUndefined(cellIndex)) {
      if (typeof input === 'string') {
        handleColorChange(rowIndex, cellIndex, input);
      } else if (typeof input === 'number') {
        const cellsCopy = [...cells];
        const cell = cellsCopy[rowIndex][cellIndex];
        if (smallNumsOn && !cell?.bigNum) {
          // new pencil mark
          if (cell && cell.smallNums && !cell.smallNums.includes(input)) {
            const numbers = cellsCopy[rowIndex][cellIndex].smallNums;
            numbers?.push(input);
            numbers?.sort();
            cellsCopy[rowIndex][cellIndex].smallNums = numbers;

            // existing pencil mark (remove)
          } else if (cell && cell.smallNums && cell.smallNums.includes(input)) {
            const indexToRemove = cell.smallNums.indexOf(input);
            if (indexToRemove > -1) {
              cell.smallNums.splice(indexToRemove, 1);
            }

            // no pencil mark but cell is 'null'
          } else if (cell && !cell.smallNums) {
            cellsCopy[rowIndex][cellIndex].smallNums = [input];

            // cell is 'null'
          } else {
            cellsCopy[rowIndex][cellIndex] = { smallNums: [input] };
          }
          setCollisions([]);
        } else if (!smallNumsOn) {
          const potentialCollisions = getCollisions(
            rowIndex,
            cellIndex,
            selectedBox,
            cellsCopy,
            input
          );

          if (isNotEmpty(potentialCollisions)) {
            setCollisions(potentialCollisions);
          } else {
            if (cellsCopy[rowIndex][cellIndex]) {
              cellsCopy[rowIndex][cellIndex].bigNum = input;
            } else {
              cellsCopy[rowIndex][cellIndex] = { bigNum: input };
            }
            setCollisions([]);
          }
        }
        setCells(cellsCopy);
      }
    }
  };

  const handleResetClick = () => {
    setCells(
      Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
    );
    setSelectedCell([null, null]);
    setCollisions([]);
  };

  const handleEraseClick = () => {
    const [rowIndex, cellIndex] = selectedCell;
    if (isNotNullOrUndefined(rowIndex) && isNotNullOrUndefined(cellIndex)) {
      const cellsCopy = [...cells];
      const cell = cellsCopy[rowIndex][cellIndex];
      if (cell?.color) {
        cellsCopy[rowIndex][cellIndex].color = null;
      } else if (cell?.bigNum && cell?.smallNums) {
        cellsCopy[rowIndex][cellIndex].bigNum = null;
      } else {
        cellsCopy[rowIndex][cellIndex] = null;
      }
      setCells(cellsCopy);
    }
  };

  return (
    <div className="app">
      <div className="appHeader">{text.misc.sudoku}</div>
      <div className="game">
        <SudokuBoard
          cells={cells}
          selectedCell={selectedCell}
          handleSudokuCellClick={handleSudokuCellClick}
          selectedBox={selectedBox}
          collisions={collisions}
        />
        <Controls
          handleInput={handleInput}
          handleResetClick={handleResetClick}
          handleEraseClick={handleEraseClick}
          smallNumsOn={smallNumsOn}
          setSmallNumsOn={setSmallNumsOn}
        />
      </div>
    </div>
  );
};

export default App;
