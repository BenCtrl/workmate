import React from 'react';

const Input = ({id, name, placeholder, value, onChange, icon, className}) => {
  return (
    <div className={`text-input ${className}`}>
      {icon && icon}
      <input id={id} name={name} placeholder={placeholder} value={value} onChange={onChange}/>
    </div>
  )
}

export default Input