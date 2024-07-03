const Button = ({
  children,
  onClick,
  toolTip,
  toolTipPos = '',
  className = '',
  style = {},
  type}) => {

  const processComponentClasses = () => {
    if (toolTip || className || toolTipPos) {
      return `${toolTip ? 'tooltip' : ''} ${className} ${toolTipPos}`.trim().replace('  ', ' ');
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