import React from 'react'
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';

export class ExperimentInfo extends React.Component {
  constructor(props) {
    super();

    this._isValid = this._isValid.bind(this);
    this.state = {
      id: props.id,
      seed: props.seed,
      size: props.size,
      valid: this._isValid(props),
    };
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

  componentWillReceiveProps(nextProps) {
    this.setState({
      id: props.id,
      seed: props.seed,
      size: props.size,
    });
  }

  componentDidMount() {
    this.refs.id.focus();
  }

  _updateState(key, value) {
    let newState = {
      ...this.state,
      [key]: value,
    };
    if (this.props.onChange) {
      this.props.onChange(newState);
    }
    this.setState({
      ...newState,
      valid: this._isValid(newState),
    });
  }

  render () {
    return (
      <div>
        <TextField ref="id"
            hintText="Numele Exeperimentului"
            floatingLabelText="ID"
            floatingLabelFixed={true}
            fullWidth={true}
            value={this.state.id}
            onChange={(e, input) => this._updateState('id', input)}
          /><br/>
        <TextField
            floatingLabelText="Seed"
            floatingLabelFixed={true}
            fullWidth={true}
            disabled={true}
            value={this.state.seed}
          /><br/>
        <TextField
            floatingLabelText="Dimensiunea Experimentului"
            floatingLabelFixed={true}
            fullWidth={true}
            value={this.state.size}
          /><br/>
        <Slider
            value={this.state.size}
            onChange={(e, input) => this._updateState('size', input)}
          />
      </div>
    )
  }
}


ExperimentInfo.defaultProps = {
  id: '',
  size: 0.1,
  seed: Math.random().toString(36).substring(7),
}

export default ExperimentInfo
