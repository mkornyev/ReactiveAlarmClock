import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// ================== RENDER SVA ======================

function SetButton() {
  // onclick -> set a specified time  
  return (
    <div className="col">
      <button className="btn btn-lg btn-dark set">Set</button>
    </div>
  )
}

function SnoozeButton() {
  // onclick -> 5 more minutes 
  return (
    <div className="col">
      <button className="btn btn-lg btn-dark snooze">Snooze</button>
    </div>
  )
}

class Clock extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      time: new Date(), // Browser Time
    }
  }

  componentDidMount(){
    this.timer = setInterval(() => (this.setState({ time: new Date() })), 1000)
  }

  componentWillUnmount(){
    clearInterval(this.timer)
  }

  render() {
    return (
      <div className="row justify-content-md-center">
        <div className="col-md-auto clock">
          {this.state.time.toLocaleTimeString()}
        </div>
      </div>
    )
  }
}

class AlarmClock extends React.Component {
  render() {
    return(
      <div className="container-fluid">
        <Clock/>

        <div className="row">
          <SetButton/>
          <SnoozeButton/>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <AlarmClock/>,
  document.getElementById('root')
);