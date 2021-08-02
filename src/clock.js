
// =================== IMPORTS ===================

import React from 'react'
import './clock.css'


// =================== ALARM FACE ===================

function Alarm(props) {
  return (
    <div className={'alarm' + (props.alarmIsOn ? ' alarm-on':'')} onClick={() => props.stopAlarm()}></div>
  )
}


// =================== CONTROL BUTTONS ===================

function SetButton(props) { 
  let buttonColorClass = props.alarmIsOn ? 'btn-danger' : 'btn-dark'
  let buttonContent = props.alarmIsOn ? 'Stop' : 'Set'
  var onClickAction = props.alarmIsOn ? props.stopAlarm : props.setAlarm

  return (
    <div className="col-sm-5">
      <button className={"set btn btn-lg " + buttonColorClass} onClick={() => onClickAction()}>{buttonContent}</button>
    </div>
  )
}

function SnoozeButton(props) {
  return (
    <div className="col-sm-5">
      <button className="snooze btn btn-lg btn-dark" onClick={() => props.onClick()} disabled={!props.alarmIsOn}>Snooze for 5 minutes</button>
    </div>
  )
}


// =================== COMPONENT ===================

class Clock extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      time: new Date(), // Browser Time
    }
  }

  componentDidMount(){
    this.timer = setInterval(() => this.updateClock(), 1000)
  }

  // Update Display & Start the alarm if needed 
  updateClock(){
    this.setState({ time: new Date() })

    if(!this.props.alarmIsOn && this.props.userAlarm && this.props.userAlarm <= this.state.time) {
      this.props.startAlarm()
    }
  }

  componentWillUnmount(){
    clearInterval(this.timer)
    if(this.props.alarmIsOn) this.props.stopAlarm()
  }

  render() {
    return (
      <div className="row justify-content-md-center">
        <div className="col-md-auto clock">

          <Alarm alarmIsOn={this.props.alarmIsOn} 
                 stopAlarm={() => this.props.stopAlarm()}/>

          {this.state.time.toLocaleTimeString()} {/* Time */}

          <div className="row button-container">
            <SetButton setAlarm={() => this.props.set()}
                       stopAlarm={() => this.props.stopAlarm()} 
                       alarmIsOn={this.props.alarmIsOn} />

            <SnoozeButton onClick={() => this.props.snooze()}
                          alarmIsOn={this.props.alarmIsOn} />
          </div>

          {this.state.time.toLocaleDateString()} {/* Date */}
        </div>
      </div>
    )
  }
}

export default Clock