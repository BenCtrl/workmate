import React from 'react';

const CheckBoxSlider = ({labelContent, checkBoxID, checked, onChange}) => {
  return (
    <div className="checkbox-switch-container">
      <span className="checkbox-switch-label" >{labelContent}</span>
      <label className="checkbox-switch" htmlFor={checkBoxID}>
        <input type="checkbox" id={checkBoxID} name={checkBoxID} checked={checked} onChange={onChange} />
        <span className="slider"></span>
      </label>
    </div>
  )
}

export default CheckBoxSlider