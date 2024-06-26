import React from 'react'

// TODO - Tooltips 
const Button = ({children, onClick, toolTip, className, type}) => {

  // TODO - interface of button types when refactored to typescript
  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
      {toolTip && <span className="tooltiptext">{toolTip}</span>}
    </button>
  )
}

export default Button