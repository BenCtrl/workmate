import React from 'react';

const Input = ({
  id,
  name,
  placeholder,
  value,
  onChange,
  icon,
  className,
  required = false
}) => {
  return (
    <div className={`text-input ${className}`}>
      {icon && icon}
      <input
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete='off'
        required={required}
      />
    </div>
  )
}

export default Input