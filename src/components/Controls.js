import React from 'react';
import { Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faPencil } from '@fortawesome/pro-solid-svg-icons';
import { faUndoAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Controls.css';
import { colorpad } from '../constants';
import {
  genericButtonStyles,
  numpadButtonStyles,
  smallNumButtonStyles,
} from '../styles/controls';
import * as text from '../text/text';

const Controls = ({
  handleInput,
  handleResetClick,
  handleEraseClick,
  smallNumsOn,
  setSmallNumsOn,
}) => {
  const numbers = React.useMemo(
    () =>
      Array(3)
        .fill(null)
        .map(() => Array(3).fill(null)),
    []
  );

  const renderNumpadButton = (rowIndex, cellIndex) => {
    const digit = rowIndex * 3 + cellIndex + 1;
    return (
      <Button
        variant="outlined"
        color="primary"
        style={numpadButtonStyles}
        key={`numpad-${rowIndex}-${cellIndex}`}
        onClick={() => handleInput(digit)}
      >
        {digit}
      </Button>
    );
  };

  const renderNumpad = () => (
    <div className="numpad">
      {numbers.map((row, rowIndex) => (
        <div key={`numpad-${rowIndex}`} className="row">
          {row.map((cell, cellIndex) =>
            renderNumpadButton(rowIndex, cellIndex)
          )}
        </div>
      ))}
      {text.hints.numpad}
    </div>
  );

  const renderColorpadButton = (rowIndex, cellIndex) => {
    const color = colorpad[rowIndex][cellIndex];
    return (
      <Button
        style={{ backgroundColor: color, ...numpadButtonStyles }}
        key={`colorpadButton-${rowIndex}-${cellIndex}`}
        onClick={() => handleInput(color)}
      />
    );
  };

  const renderColorpad = () => (
    <div className="colorpad">
      {colorpad.map((row, rowIndex) => (
        <div key={`colorpad-${rowIndex}`} className="row">
          {row.map((cell, cellIndex) =>
            renderColorpadButton(rowIndex, cellIndex)
          )}
        </div>
      ))}
      {text.hints.colorpad}
    </div>
  );

  const renderGameButtons = () => (
    <div className="gameButtons">
      <Button
        variant="contained"
        color="secondary"
        style={genericButtonStyles}
        onClick={handleEraseClick}
      >
        <div className="buttonContent">
          <FontAwesomeIcon icon={faEraser} className="icon" />
          <div className="buttonText">
            {text.buttonContent.erase}{' '}
            <div style={{ fontSize: '10px' }}>
              {text.buttonContent.backspace}
            </div>
          </div>
        </div>
      </Button>
      <Button
        variant="contained"
        color="secondary"
        style={genericButtonStyles}
        onClick={handleResetClick}
      >
        <div className="buttonContent">
          <FontAwesomeIcon icon={faUndoAlt} className="icon" />
          <div className="buttonText">{text.buttonContent.reset}</div>
        </div>
      </Button>
    </div>
  );

  const renderSmallNumberToggleButton = (on) => (
    <Button
      variant="contained"
      color={on ? 'primary' : 'default'}
      style={smallNumButtonStyles}
      onClick={() => setSmallNumsOn(!on)}
    >
      <div className="buttonContent">
        <FontAwesomeIcon icon={faPencil} className="icon" />
        <div className="buttonText">
          {text.buttonContent.pencil}{' '}
          <div style={{ fontSize: '10px' }}>{text.buttonContent.capslock}</div>
        </div>
      </div>
    </Button>
  );

  return (
    <div className="controls">
      {renderNumpad()}
      {renderColorpad()}
      {renderSmallNumberToggleButton(smallNumsOn)}
      {renderGameButtons()}
    </div>
  );
};

export default Controls;
