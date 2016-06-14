import React from 'react'
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';

export class ExperimentInfo extends React.Component {
  constructor(props) {
    super();

    this._isValid = this._isValid.bind(this);
    this.state = {
      info: props.info || {
        id: '',
        size: 0.1,
        seed: Math.random().toString(36).substring(7),
      },
      valid: false,
    };
  }

  componentDidMount() {
    this.refs.id.focus();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.info != nextProps.info) {
      this.setState({info: nextProps.info})
    }
  }

  _isValid(obj) {
    if (!obj.id || obj.id == '') {
      return false;
    }
    if (!obj.seed || obj.seed == '') {
      return false;
    }
    if (!obj.size || obj.size <= 0 || obj.size > 1 ) {
      return false;
    }
    return true;
  }

  _updateState(key, value) {
    let newInfo = {
      ...this.state.info,
      [key]: value,
    };
    let newState = {
        info: newInfo,
        valid: this._isValid(newInfo),
    }
    if (this.props && this.props.onChange) {
      this.props.onChange(newState);
    }
    this.setState(newState);
  }

  render () {
    return (
      <div>
        <TextField ref="id"
            hintText="Numele Exeperimentului"
            floatingLabelText="ID"
            floatingLabelFixed={true}
            fullWidth={true}
            value={this.state.info.id}
            onChange={(e, input) => this._updateState('id', input)}
          /><br/>
        <TextField
            floatingLabelText="Seed"
            floatingLabelFixed={true}
            fullWidth={true}
            disabled={true}
            value={this.state.info.seed}
          /><br/>
        <TextField
            floatingLabelText="Size"
            floatingLabelFixed={true}
            fullWidth={true}
            value={this.state.info.size}
          /><br/>
        <Slider
            value={this.state.info.size}
            onChange={(e, input) => this._updateState('size', input)}
          />
      </div>
    )
  }
}

export default ExperimentInfo
