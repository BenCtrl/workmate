import React, { useContext, useRef, useState } from 'react';

import { AppSettingsContext } from '../../App';
import { useClickOutside } from '../../hooks/useClickOutside';

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

  const buttonRef = useRef();
  const [askConfirm, setAskConfirm] = useState(false);
  const SETTINGS = useContext(AppSettingsContext).appSettings;

  const processComponentClasses = () => {
    // if (toolTip || className || toolTipPos) {
    if (toolTip || className) {
      // return `${toolTip && SETTINGS.TOOLTIPS ? 'tooltip' : ''} ${className} ${toolTipPos}`.trim().replace('  ', ' ');
      return `${className} ${askConfirm ? 'error' : ''}`.trim().replace('  ', ' ');
    } else {
      return undefined;
    }
  }

  useClickOutside(buttonRef, () => {setAskConfirm(false)});

  // **TODO - Temporarily disabled custom tooltips due to many styling issues
  // TODO - interface of button types when refactored to typescript
  return (
    <button
      ref={buttonRef}
      type={type}
      className={processComponentClasses()}
      id={id}
      style={style}
      // data-text={toolTip}
      title={SETTINGS.TOOLTIPS && toolTip}
      onClick={SETTINGS.CONFIRM_BEFORE_DELETE & type === 'delete' ? askConfirm ? onClick : () => {setAskConfirm(true)} : onClick}
      disabled={disabled}
    >
      {askConfirm ? 'Are you sure?' : children}
    </button>
  )
}

export default Button