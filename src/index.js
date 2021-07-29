import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// ===================== Control Buttons =====================

function SetButton(props) { 
  let buttonColorClass = props.alarmIsOn ? 'btn-danger' : 'btn-dark'
  let buttonContent = props.alarmIsOn ? 'Stop' : 'Set'
  var onClickAction = props.alarmIsOn ? props.stopAlarm : props.setAlarm

  return (
    <div className="col">
      <button className={"set btn btn-lg " + buttonColorClass} onClick={() => onClickAction()}>{buttonContent}</button>
    </div>
  )
}

function SnoozeButton(props) {
  return (
    <div className="col">
      <button className="btn btn-lg btn-dark snooze" onClick={() => props.onClick()} disabled={!props.alarmIsOn}>Snooze</button>
    </div>
  )
}


// ===================== Clock =====================

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

  // Update Display & Set of the alarm if needed 
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
          {this.state.time.toLocaleTimeString()}
            <div className="row button-container">
              <SetButton setAlarm={() => this.props.set()}
                         stopAlarm={() => this.props.stopAlarm()} 
                         alarmIsOn={this.props.alarmIsOn} />
              <SnoozeButton onClick={() => this.props.snooze()}
                            alarmIsOn={this.props.alarmIsOn} />
            </div>
          {this.state.time.toLocaleDateString()}
        </div>
      </div>
    )
  }
}


// ===================== AlarmClock =====================

class AlarmClock extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userAlarm: null,
      isOn: false,
    }
  }

  // Load alarm in local storage on first load
  componentDidMount(){
    let preset = localStorage.getItem("REACTIVE_ALARM_TIME")
    let setAlarm = new Date(preset)

    if(!preset || !setAlarm) return

    this.setState({ userAlarm: setAlarm })
  }

  // Set an alarm 
  setAlarm() {
    let currDate = new Date()
    currDate.setSeconds((currDate.getSeconds() + 5) % 60)
    let setDate = `${currDate.toLocaleDateString()}, ${currDate.toLocaleTimeString()}`

    localStorage.setItem("REACTIVE_ALARM_TIME", setDate)
    this.setState({
      userAlarm: currDate,
    })
    console.log(`Alarm set for: ${setDate}`)
  }

  // @param duration = time in minutes
  snoozeAlarm(duration=5) {
    if(!this.state.userAlarm || !this.state.isOn) return

    let currDate = new Date()
    currDate.setSeconds(currDate.getSeconds() + 5)
    // currDate.setMinutes(currDate.getMinutes() + duration) // OVERFLOW DELEGATED TO DATE CLASS
    let snoozeDate = `${currDate.toLocaleDateString()}, ${currDate.toLocaleTimeString()}`

    localStorage.setItem("REACTIVE_ALARM_TIME", snoozeDate)
    this.setState({
      userAlarm: currDate,
      isOn: false,
    })
    console.log(`Alarm snoozed until: ${snoozeDate}`)
  }

  // @staticmethod
  startAlarm() {
    console.log('PLAYING ALARM!')

    this.setState({
      isOn: true,
    })
  }

  stopAlarm() {
    console.log('Stopping ALARM!')

    localStorage.removeItem("REACTIVE_ALARM_TIME")
    this.setState({
      userAlarm: null,
      isOn: false,
    })
  }

  render() {
    return(
      <div className="container-fluid">
        <Clock userAlarm={this.state.userAlarm} 
               alarmIsOn={this.state.isOn} 
               set={() => this.setAlarm()}
               snooze={() => this.snoozeAlarm()}
               startAlarm={() => this.startAlarm()} 
               stopAlarm={() => this.stopAlarm()} />
      </div>
    )
  }
}


// ===================== Root Render =====================

ReactDOM.render(
  <AlarmClock/>,
  document.getElementById('root')
);