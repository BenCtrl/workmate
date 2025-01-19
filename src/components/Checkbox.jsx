import React from 'react'
import { FaCheck } from 'react-icons/fa6'

const Checkbox = ({
  className,
  label,
  onChange,
  id,
  checked,
  toolTip
}) => {
  return (
    <label htmlFor={id} title={toolTip} className={`checkbox-container ${className}`}>{label}
      <input id={id} type="checkbox" onChange={onChange} checked={checked} />
      <span className="checkbox"><div className="checkbox-icon"><FaCheck /></div></span>
    </label>
  )
}

export default Checkbox