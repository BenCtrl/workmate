import React, { useContext } from 'react';
import { AppSettingsContext } from '../App';

const Button = ({
  children,
  onClick,
  toolTip,
  toolTipPos = '',
  className = '',
  style = {},
  type,
  disabled}) => {

  const SETTINGS = useContext(AppSettingsContext).appSettings;

  const processComponentClasses = () => {
    if (toolTip || className || toolTipPos) {
      return `${toolTip && SETTINGS.TOOLTIPS ? 'tooltip' : ''} ${className} ${toolTipPos}`.trim().replace('  ', ' ');
    } else {
      return undefined;
    }
  }

  // TODO - interface of button types when refactored to typescript
  return (
    <button
      type={type}
      className={processComponentClasses()}
      style={style}
      data-text={toolTip}
      onClick={onClick}
      disabled={disabled}>
      {children}
    </button>
  )
}

export default Button