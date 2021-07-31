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

function Alarm(props) {
  return (
    <div className={'alarm' + (props.alarmIsOn ? ' alarm-on':'')} onClick={() => props.stopAlarm()}></div>
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


// ===================== AlarmClock =====================

class AlarmClock extends React.Component {
  constructor(props) {
    super(props)
    this.ALARM_AUDIO_URL = process.env.PUBLIC_URL + '/alarmTone.mp3'
    this.LOCALSTORGE_ALARM_KEY = 'REACTIVE_ALARM_TIME'
    this.state = {
      userAlarm: null,
      alarmAudio: null,
      isOn: false,
    }
    this.handleInitialPageClick = this.handleInitialPageClick.bind(this);
  }

  // Load alarm in local storage on first load
  componentDidMount(){
    let preset = localStorage.getItem(this.LOCALSTORGE_ALARM_KEY)
    let setAlarm = new Date(preset)

    if(!preset || !setAlarm) return

    this.setState({ userAlarm: setAlarm })
    document.addEventListener('mousedown', this.handleInitialPageClick);
  }

  // Listener to handle "ON" alarm state on page load 
  // EXPLANATION: chrome will not allow a page to play a sound until the user interacts with the page
  // This contradicts the intended behavior of the alarm
  handleInitialPageClick(){ 
    if(this.state.isOn) { this.state.alarmAudio.play() }
    document.removeEventListener('mousedown', this.handleInitialPageClick);
  }

  setAlarm() {
    let currDate = new Date()
    currDate.setSeconds((currDate.getSeconds() + 5) % 60)
    let setDate = `${currDate.toLocaleDateString()}, ${currDate.toLocaleTimeString()}`

    localStorage.setItem(this.LOCALSTORGE_ALARM_KEY, setDate)
    this.setState({
      userAlarm: currDate,
    })
    console.log(`Alarm set for: ${setDate}`)
  }

  snoozeAlarm(duration=5) {
    if(!this.state.userAlarm || !this.state.isOn) return
    this.stopAlarm()

    let currDate = new Date()
    currDate.setSeconds(currDate.getSeconds() + 5)
    // currDate.setMinutes(currDate.getMinutes() + duration) // OVERFLOW DELEGATED TO DATE CLASS
    let snoozeDate = `${currDate.toLocaleDateString()}, ${currDate.toLocaleTimeString()}`

    localStorage.setItem(this.LOCALSTORGE_ALARM_KEY, snoozeDate)
    this.setState({
      userAlarm: currDate,
      isOn: false,
    })
    console.log(`Alarm snoozed until: ${snoozeDate}`)
  }

  startAlarm() {
    console.log('PLAYING ALARM!')

    if(!this.state.alarmAudio) {
      const audio = new Audio(this.ALARM_AUDIO_URL)
      audio.loop = true
      audio.play()
      
      this.setState({ alarmAudio: audio })
    } else {
      this.state.alarmAudio.play()
    }

    this.setState({ isOn: true })
  }

  stopAlarm() {
    if(!this.state.isOn) return
    console.log('Stopping ALARM!')

    if(this.state.alarmAudio) this.state.alarmAudio.pause()

    localStorage.removeItem(this.LOCALSTORGE_ALARM_KEY)
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