import React from 'react'
import {
  Step,
  Stepper,
  StepLabel,
  StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import classes from './NewExperiment.scss'

class NewExperiment extends React.Component {
  render () {
    return (
      <div>
      <Stepper activeStep={0} orientation="vertical">
       <Step>
         <StepLabel>Experiment</StepLabel>
         <StepContent>
           <p>
             Step 1
           </p>
         </StepContent>
       </Step>
       </Stepper>
      </div>
    )
  }
}

export default NewExperiment
