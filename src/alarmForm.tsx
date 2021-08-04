
// =================== IMPORTS ===================

import React, {LegacyRef} from 'react'
import './alarmForm.css'


// =================== COMPONENT TYPES ===================

type AlarmFormProps = { 
  isBeingSet: Boolean,
  saveSetting: () => void,
  stopSetting: () => void,
  clearSetting: () => void,
}


// =================== COMPONENT ===================

class AlarmForm extends React.Component<AlarmFormProps, {}>{
  input: React.RefObject<unknown>
  timestamp: string

  constructor(props: AlarmFormProps) {
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
                    ref={this.input as LegacyRef<HTMLInputElement>}
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

export default AlarmForm