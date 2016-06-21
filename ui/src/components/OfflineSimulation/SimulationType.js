import React from 'react'
import Divider from 'material-ui/Divider';
import * as Colors from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import __ from 'lodash';

const style={
  backgroundColor: 'white',
}
const innerDiv={
  backgroundColor: 'white',
  border: '1px solid white',
}

export class SimulationType extends React.Component {
  constructor(props) {
    super();
  }

  _change = (field, value) => {
    this.props.onChange && this.props.onChange({
      ...this.props.simulation,
      [field]: value,
    })
  }

  _experimentSpecific = (group, field) => {
    return this.props.id + "_" + group + "_" + field;
  }

  _changeSpecific = (group, field, value) => {
    this.props.onChange && this.props.onChange({
      ...this.props.simulation,
      [this._experimentSpecific(group, field)]: value,
    })
  }

  render () {
    return (
      <div>
        <SelectField
            style={{
              width: '49%',
            }}
            value={this.props.simulation.assigner}
            floatingLabelText="Assigner Type"
            onChange={(evt, index, value) => this._change("assigner", value)}
        >
          <MenuItem style={style} innerDivStyle={innerDiv} value="ab" primaryText="AB Testing" />
          <MenuItem style={style} innerDivStyle={innerDiv} value="multiarm" primaryText="Multi-armed Bandit" />
          <MenuItem style={style} innerDivStyle={innerDiv} value="experimento" primaryText="Experimento Assigner" />
        </SelectField>
        <SelectField
            value={this.props.simulation.distribution}
            style={{
              marginLeft: 10,
              width: '49%',
            }}
            floatingLabelText="Metric distribution"
            onChange={(evt, index, value) => this._change("distribution", value)}
          >
          <MenuItem style={style} innerDivStyle={innerDiv} value="bernoulli" primaryText="Bernoulli" />
          <MenuItem style={style} innerDivStyle={innerDiv} value="normal" primaryText="Normal" />
        </SelectField>
        <br/>
        {__.map(this.props.groups, (info, name) =>
        <div key={name} style={{display: 'inline-block', marginRight: 10, minWidth: '48.5%'}}>
          <div style={{fontSize: 16, fontWeight: 'bold', display: 'inline-block', marginTop: 10}}>
            Group {name}
          </div>
        {(this.props.simulation.distribution == 'bernoulli') ?
            <div>
              <TextField
                hintText="Success probability"
                fullWidth={true}
                value={this.props.simulation[this._experimentSpecific(name, 'bernoulli')]}
                floatingLabelText="Bernoulli Probability"
                onChange={(evt, value) => this._changeSpecific(name, "bernoulli", value)}
              />
            </div>
         : this.props.simulation.distribution == 'normal' ?
           <div>
              <TextField
                hintText="Normal Mean"
                fullWidth={true}
                value={this.props.simulation[this._experimentSpecific(name, 'normalMean')]}
                floatingLabelText="Normal Mean"
                onChange={(evt, value) => this._changeSpecific(name, "normalMean", value)}
              />
            <TextField
                hintText="Normal SD"
                fullWidth={true}
                value={this.props.simulation[this._experimentSpecific(name, 'normalSD')]}
                floatingLabelText="Normal SD"
                onChange={(evt, value) => this._changeSpecific(name, "normalSD", value)}
              />
           </div>
         : <div></div>
       }</div>
       )}
      </div>
    )
  }
}

SimulationType.defaultProps = {
  simulation: {}
};

export default SimulationType
