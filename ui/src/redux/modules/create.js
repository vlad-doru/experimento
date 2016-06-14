// Constants
const EXPERIMENT = 'ui/create/EXPERIMENT';
const STEP_INDEX = 'ui/create/STEP_INDEX';

// Action Creators
export function setExperiment(experiment) {
  return {
    type: EXPERIMENT,
    experiment: experiment,
  }
}

export function setStep(index) {
  return {
    type: STEP_INDEX,
    index: index,
  }
}

// Reducer
const initialState = {
  stepIndex: 0,
}
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case EXPERIMENT:
      return {
        ...state,
        info: action.experiment.info,
        validInfo: action.experiment.valid,
      }
    case STEP_INDEX:
      return {
        ...state,
        stepIndex: action.index,
      }
    default:
      return state
  }
}
