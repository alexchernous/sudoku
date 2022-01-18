import { boxes } from '../constants';
import { isNotNullOrUndefined } from './utils';

export const getCollisions = (
  selectedRowIndex,
  selectedCellIndex,
  selectedBox,
  cells,
  number
) => {
  const rowCollision = cells[selectedRowIndex].reduce(
    (acc, cell, cellIndex) => {
      if (cell?.bigNum === number) {
        acc.push([selectedRowIndex, cellIndex]);
      }
      return acc;
    },
    []
  );
  const colCollision = cells.reduce((acc, row, rowIndex) => {
    if (row[selectedCellIndex]?.bigNum === number) {
      acc.push([rowIndex, selectedCellIndex]);
    }
    return acc;
  }, []);

  let boxCollision = [];
  for (let i = selectedBox.topLeft[0]; i <= selectedBox.bottomRight[0]; i++) {
    for (let j = selectedBox.topLeft[1]; j <= selectedBox.bottomRight[1]; j++) {
      if (cells[i][j]?.bigNum === number) {
        boxCollision.push([i, j]);
      }
    }
  }

  return [...rowCollision, ...colCollision, ...boxCollision];
};

export const getCurrentBox = ([rowIndex, cellIndex]) => {
  if (isNotNullOrUndefined(rowIndex) && isNotNullOrUndefined(cellIndex)) {
    const selectedBox = boxes.find(
      ({ topLeft, bottomRight }) =>
        rowIndex >= topLeft[0] &&
        rowIndex <= bottomRight[0] &&
        cellIndex >= topLeft[1] &&
        cellIndex <= bottomRight[1]
    );

    return selectedBox;
  }

  return null;
};

export const isInSelectedBox = (rowIndex, cellIndex, selectedBox) =>
  selectedBox &&
  rowIndex >= selectedBox.topLeft[0] &&
  rowIndex <= selectedBox.bottomRight[0] &&
  cellIndex >= selectedBox.topLeft[1] &&
  cellIndex <= selectedBox.bottomRight[1];
