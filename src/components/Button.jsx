import React, { useContext } from 'react';
import { AppSettingsContext } from '../App';

const Button = ({
  children,
  onClick,
  toolTip,
  // toolTipPos = '',
  className = '',
  id,
  style = {},
  type,
  disabled}) => {

  const SETTINGS = useContext(AppSettingsContext).appSettings;

  const processComponentClasses = () => {
    if (toolTip || className || toolTipPos) {
      // return `${toolTip && SETTINGS.TOOLTIPS ? 'tooltip' : ''} ${className} ${toolTipPos}`.trim().replace('  ', ' ');
      return `${className}`.trim().replace('  ', ' ');
    } else {
      return undefined;
    }
  }

  // **TODO - Temporarily disabled custom tooltips due to many styling issues
  // TODO - interface of button types when refactored to typescript
  return (
    <button
      type={type}
      className={processComponentClasses()}
      id={id}
      style={style}
      // data-text={toolTip}
      title={toolTip}
      onClick={onClick}
      disabled={disabled}>
      {children}
    </button>
  )
}

export default Button