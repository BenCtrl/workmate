import React, { useContext } from 'react';
import { AppConfigurationContext } from '../context/AppConfigurationContext';

const Button = ({
  children,
  onClick,
  toolTip,
  toolTipPos = '',
  className = '',
  style = {},
  type}) => {

  const SETTINGS = useContext(AppConfigurationContext);

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
      onClick={onClick}>
      {children}
    </button>
  )
}

export default Button