import React from 'react';

const Alert = ({alertType, message}) => {
  return (
    <span className={`alert ${alertType}`}>{message}</span>
  )
}

export default Alert