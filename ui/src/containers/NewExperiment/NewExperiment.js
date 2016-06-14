import React from 'react'
import {
  Step,
  Stepper,
  StepLabel,
  StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import ExperimentInfo from '../../components/ExperimentInfo'

import classes from './NewExperiment.scss'

class NewExperiment extends React.Component {
  constructor(props) {
    super();

    this.state = {
      stepIndex: 0,
      expInfo: {},
    }
  }

  handleNext = () => {
     const {stepIndex} = this.state;
     this.setState({
       stepIndex: stepIndex + 1,
     });
   };

   handlePrev = () => {
     const {stepIndex} = this.state;
     if (stepIndex > 0) {
       this.setState({stepIndex: stepIndex - 1});
     }
   };

  renderStepActions(step, valid) {
    const {stepIndex} = this.state;

    return (
      <div style={{margin: '12px 0'}}>
        <RaisedButton
          disabled={!valid}
          label={stepIndex === 2 ? 'Finish' : 'Next'}
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onTouchTap={this.handleNext}
          style={{marginRight: 12}}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disableTouchRipple={true}
            disableFocusRipple={true}
            onTouchTap={this.handlePrev}
          />
        )}
      </div>
    );
  }

  render () {
    return (
      <div>
      <Stepper activeStep={this.state.stepIndex} orientation="vertical">
       <Step>
         <StepLabel>Experiment Info</StepLabel>
         <StepContent>
           <ExperimentInfo
              info={this.state.expInfo.info}
              onChange={(data) =>
                this.setState({expInfo: data})
              }/>
           {this.renderStepActions(0, this.state.expInfo.valid)}
         </StepContent>
       </Step>
       <Step>
         <StepLabel>Experiment Info</StepLabel>
         <StepContent>
           Chestie
           {this.renderStepActions(1, false)}
         </StepContent>
       </Step>
      </Stepper>
      </div>
    )
  }
}

export default NewExperiment
