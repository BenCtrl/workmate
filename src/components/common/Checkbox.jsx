import React from 'react';

import { IconCheck } from '../Icons';

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
      <span className="checkbox"><div className="checkbox-icon"><IconCheck /></div></span>
    </label>
  )
}

export default Checkbox