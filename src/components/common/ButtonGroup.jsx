import React from 'react'

/**
 * Renders a collective of buttons contained in a single component.
 */
const ButtonGroup = ({children, style}) => {
  return (
    <div style={style} className="button-group">
      {children}
    </div>
  )
}

export default ButtonGroup