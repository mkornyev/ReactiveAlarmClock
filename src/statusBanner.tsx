
// =================== IMPORTS ===================

import React from 'react'
import './statusBanner.css'


// =================== COMPONENT TYPES ===================

type StatusBannerProps = { 
  userAlarm?: Date,
  hide: Boolean,
}


// =================== COMPONENT ===================

function StatusBanner(props: StatusBannerProps) {
  if(props.userAlarm){
    let currDate = new Date()
    let dateString = props.userAlarm.getDay() !== currDate.getDay() ? `on ${props.userAlarm.toLocaleDateString()}`:''
    let alarmDecomp = props.userAlarm.toLocaleTimeString().split(':')
    let alarmRemainder = alarmDecomp.pop()
    let status = props.userAlarm ? `You've set an alarm for ${alarmDecomp.join(':') + ' ' + alarmRemainder.split(' ')[1]} ${dateString}`:'Set an alarm below...'

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