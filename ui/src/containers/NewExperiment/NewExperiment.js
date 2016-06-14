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
  render () {
    return (
      <div>
      <Stepper activeStep={0} orientation="vertical">
       <Step>
         <StepLabel>Experiment Info</StepLabel>
         <StepContent>
           <ExperimentInfo />
         </StepContent>
       </Step>
      </Stepper>
      </div>
    )
  }
}

export default NewExperiment
