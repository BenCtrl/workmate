import React from 'react'
import '../styling/shared.css'

const Alert = ({alertType, message}) => {
  return (
    <span className={`alert ${alertType}`}>{message}</span>
  )
}

export default Alert