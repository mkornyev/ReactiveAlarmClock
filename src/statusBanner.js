
// =================== IMPORTS ===================

import React from 'react'
import './statusBanner.css'


// =================== COMPONENT ===================

function StatusBanner(props) {
  if(props.userAlarm){
    let currDate = new Date()
    let onString = props.userAlarm.getDay() !== currDate.getDay() ? `on ${props.userAlarm.toLocaleDateString()}`:''
    let status = props.userAlarm ? `You've set an alarm for ${props.userAlarm.toLocaleTimeString()} ${onString}`:'Set an alarm below...'

    return (
      <div className='row justify-content-md-center'>
        <div className='col message-banner'>
          {!props.hide ? status:''}
        </div>
      </div>
    )
  }
  return (<div></div>)
}

export default StatusBanner