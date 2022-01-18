import { thickBorderCells } from '../constants';
import { isInSelectedBox } from './boardUtils';
import { isNotNullOrUndefined, isNotEmpty } from './utils';

export const getClassNames = ({
  selectedCell,
  rowIndex,
  cellIndex,
  cells,
  selectedBox,
  collisions,
}) => {
  const [selectRowIndex, selectCellIndex] = selectedCell;
  const selectedNumber =
    isNotNullOrUndefined(selectRowIndex) &&
    isNotNullOrUndefined(selectCellIndex)
      ? cells[selectRowIndex][selectCellIndex]?.bigNum
      : null;
  const currentNumber = cells[rowIndex][cellIndex]?.bigNum;
  const highlightBox = isInSelectedBox(rowIndex, cellIndex, selectedBox)
    ? ' highlightCells'
    : '';
  const collision = collisions.find(
    (cell) => cell[0] === rowIndex && cell[1] === cellIndex
  );
  const highlightCollisions = isNotEmpty(collision)
    ? ' highlightCollision'
    : '';

  const highlightAllNumbers =
    selectedNumber && selectedNumber === currentNumber ? ' selectedCell' : '';
  const highlightSelectedCell =
    selectRowIndex === rowIndex && selectCellIndex === cellIndex
      ? ' selectedCell'
      : '';

  const highlightRowCol =
    selectRowIndex === rowIndex || selectCellIndex === cellIndex
      ? ' highlightCells'
      : '';
  const thickBorderRow = thickBorderCells.includes(rowIndex)
    ? ' thickBottom'
    : '';
  const thickBorderCell = thickBorderCells.includes(cellIndex)
    ? ' thickRight'
    : '';

  return [
    highlightAllNumbers,
    highlightSelectedCell,
    highlightRowCol,
    thickBorderRow,
    thickBorderCell,
    highlightBox,
    highlightCollisions,
  ];
};
