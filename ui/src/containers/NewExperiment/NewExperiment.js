import React from 'react'
import {connect} from 'react-redux';
import {
  Step,
  Stepper,
  StepLabel,
  StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import ExperimentInfo from '../../components/ExperimentInfo'
import VariableInfo from '../../components/VariableInfo'

import * as createActions from '../../redux/modules/create';

@connect(
  state => ({
    info: state.create.info,
    validInfo: state.create.validInfo,

    variables: state.create.variables,
    validVariables: state.create.validVariables,
    variableInput: state.create.variableInput,

    stepIndex: state.create.stepIndex,
  }),
  createActions)
class NewExperiment extends React.Component {
  constructor(props) {
    super();
  }

  renderStepActions(step, valid) {

    return (
      <div style={{margin: '12px 0'}}>
        <RaisedButton
          disabled={!valid}
          label={this.props.stepIndex === 2 ? 'Finish' : 'Next'}
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onTouchTap={() => this.props.setStep(this.props.stepIndex + 1)}
          style={{marginRight: 12}}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disableTouchRipple={true}
            disableFocusRipple={true}
            onTouchTap={() => this.props.setStep(this.props.stepIndex - 1)}
          />
        )}
      </div>
    );
  }

  render () {
    return (
      <div>
      <Stepper activeStep={this.props.stepIndex} orientation="vertical">
       <Step>
         <StepLabel>Experiment Info</StepLabel>
         <StepContent>
           <ExperimentInfo
              info={this.props.info}
              onChange={(data) =>
                this.props.setExperiment(data)
              }/>
            {this.renderStepActions(0, this.props.validInfo)}
         </StepContent>
       </Step>
       <Step>
         <StepLabel>Variables Info</StepLabel>
         <StepContent>
           <VariableInfo
             variables={this.props.variables}
             variableInput={this.props.variableInput}
             onChange={(data) =>
               this.props.setVariables(data)
             }/>
           {this.renderStepActions(1, this.props.validVariables)}
         </StepContent>
       </Step>
      </Stepper>
      </div>
    )
  }
}

export default NewExperiment
