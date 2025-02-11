import React from 'react'

import { Button } from '../CommonComponents'

/**
 * Overload of <Button /> component that hard sets the buttons 'type' to 'delete'. The setting of this
 * property is to be compared to the corresponding app setting to determine if the button should ask
 * for confirmation from the user before performing a deletion action.
 *
 * @param {*} param0 
 * @returns 
 */
const DeleteConfirmButton = ({
  children,
  onClick,
  toolTip,
  // toolTipPos = '',
  className,
  id,
  style,
  disabled
}) => {
  return (
    <>
      <Button
        children={children}
        onClick={onClick}
        toolTip={toolTip}
        className={className}
        id={id}
        style={style}
        type='delete'
        disabled={disabled}
      />
    </>
  )
}

export default DeleteConfirmButton