
// =================== IMPORTS ===================

import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'

import Clock from './clock'
import AlarmForm from './alarmForm'
import StatusBanner from './statusBanner'


// =================== COMPONENT TYPES ===================

type AlarmClockState = { 
  userAlarm?: Date,
  alarmAudio?: HTMLAudioElement, 
  isOn: Boolean,
  isBeingSet: Boolean,
}


// =================== COMPONENT ===================

class AlarmClock extends React.Component<{}, AlarmClockState> {
  static ALARM_AUDIO_URL: string = process.env.PUBLIC_URL + '/ringtones/apple_ding.mp3' 
  static LOCALSTORGE_ALARM_KEY: string = 'REACTIVE_ALARM_TIME'
  
  constructor(props: {}) {
    super(props)
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
    let preset = localStorage.getItem(AlarmClock.LOCALSTORGE_ALARM_KEY)
    let setAlarm = preset ? new Date(preset):null

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
    currDate.setMinutes(currDate.getMinutes() + duration) // OVERFLOW DELEGATED TO DATE CLASS
    let snoozeDate = `${currDate.toLocaleDateString()}, ${currDate.toLocaleTimeString()}`

    localStorage.setItem(AlarmClock.LOCALSTORGE_ALARM_KEY, snoozeDate)
    this.setState({
      userAlarm: currDate,
      isOn: false,
    })
  }

  startAlarm() {
    if(!this.state.alarmAudio) {
      const audio = new Audio(AlarmClock.ALARM_AUDIO_URL)
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
    if(this.state.alarmAudio) this.state.alarmAudio.pause()

    localStorage.removeItem(AlarmClock.LOCALSTORGE_ALARM_KEY)
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
    let dateInput = (document.getElementById('alarm-datetime-input') as HTMLTextAreaElement).value
    let setDate = new Date(dateInput)
    let stringDate = `${setDate.toLocaleDateString()}, ${setDate.toLocaleTimeString()}`

    if(stringDate && setDate) {
      localStorage.setItem(AlarmClock.LOCALSTORGE_ALARM_KEY, stringDate)
      this.setState({
        userAlarm: setDate,
        isBeingSet: false,
      })
      this.stopSetting()
    }
  }

  clearSetting() {
    localStorage.removeItem(AlarmClock.LOCALSTORGE_ALARM_KEY)
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