import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './mobile-styles.css';


// ===================== Control Buttons =====================

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
      <button className="btn btn-lg btn-dark snooze" onClick={() => props.onClick()} disabled={!props.alarmIsOn}>Snooze for 5 minutes</button>
    </div>
  )
}

// ===================== Alarm Element =====================

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


// ===================== Alarm Form =====================

class AlarmForm extends React.Component{
  constructor(props) {
    super(props)
    this.input = React.createRef();
  }

  render() {
    let d = new Date()
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    this.timestamp = d.toISOString().slice(0,16);

    return (
      <div className={"splash-page" + ( this.props.isBeingSet ? ' splash-expanded':'')}>
        <div className='row'>
          <div className='col'>
            
            <label htmlFor="alarm-datetime-input" className="form-label">Set an Alarm:</label>
            <input id="alarm-datetime-input" 
                    ref={this.input}
                    type="datetime-local" 
                    className="form-control" 
                    defaultValue={this.timestamp}
                    min={this.timestamp}
                  />
            <button className="btn btn-lg btn-light"
                    onClick={() => this.props.saveSetting()}>Set Alarm</button>
            <button className="btn btn-lg btn-light" 
                    onClick={() => this.props.stopSetting()}>Cancel</button>
            <button className="btn btn-lg btn-danger clear-button"
                    onClick={() => this.props.clearSetting()}>Clear Alarm</button>
          </div>
        </div>
      </div>
    )
  }
}


// ===================== Message Banner =====================
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


// ===================== AlarmClock =====================

class AlarmClock extends React.Component {
  constructor(props) {
    super(props)
    this.ALARM_AUDIO_URL = process.env.PUBLIC_URL + '/ringtones/apple_ding.mp3'
    this.LOCALSTORGE_ALARM_KEY = 'REACTIVE_ALARM_TIME'
    this.state = {
      userAlarm: null,
      alarmAudio: null,
      isOn: false,
      isBeingSet: false,
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

  snoozeAlarm(duration=5) {
    if(!this.state.userAlarm || !this.state.isOn) return
    this.stopAlarm()

    let currDate = new Date()
    currDate.setMinutes(currDate.getMinutes() + duration)
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

    this.setState({ 
      isOn: true,
      isBeingSet: false,
    })
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

  startSetting() {
    this.setState({
      isBeingSet: true,
    })
  }
  
  stopSetting() {
    this.setState({
      isBeingSet: false,
    })
  }

  saveSetting() {
    // if(!this.state.isBeingSet){
    //   this.setState({ isBeingSet: true })
    //   return 
    // }
    let setDate = document.getElementById('alarm-datetime-input')
    setDate = new Date(setDate.value)
    let stringDate = `${setDate.toLocaleDateString()}, ${setDate.toLocaleTimeString()}`

    if(stringDate && setDate) {
      localStorage.setItem(this.LOCALSTORGE_ALARM_KEY, stringDate)
      this.setState({
        userAlarm: setDate,
        isBeingSet: false,
      })
      this.stopSetting()
      console.log(`Alarm set for: ${stringDate}`)
    }
  }

  clearSetting() {
    this.setState({
      userAlarm: null,
      isBeingSet: false,
    })
  }

  render() {
    return(
      <div className="container-fluid">
        <StatusBanner userAlarm={this.state.userAlarm}
                      hide={this.state.isOn}/>

        <AlarmForm 
               isBeingSet={this.state.isBeingSet}
               saveSetting={() => this.saveSetting()} 
               stopSetting={() => this.stopSetting()} 
               clearSetting={() => this.clearSetting()}/>

        <Clock userAlarm={this.state.userAlarm} 
               alarmIsOn={this.state.isOn} 
               set={() => this.startSetting()}
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