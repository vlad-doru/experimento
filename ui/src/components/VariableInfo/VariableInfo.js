import React from 'react'
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';

export class ExperimentInfo extends React.Component {
  constructor(props) {
    super();

    this._isValid = this._isValid.bind(this);
    this.state = {
      info: props.info || {

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
            hintText="Numele Variabilei"
            floatingLabelText="Variabila"
            floatingLabelFixed={true}
            fullWidth={true}
            value={this.state.info.id}
            onChange={(e, input) => this._updateState('id', input)}
          /><br/>
      </div>
    )
  }
}

export default ExperimentInfo
