// Constants
const EXPERIMENT = 'ui/create/EXPERIMENT';

// Action Creators
export function setExperiment(experiment) {
  return {
    type: EXPERIMENT,
    experiment: experiment,
  }
}

// Reducer
const initialState = {}
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case EXPERIMENT:
      return {
        ...state,
        info: action.experiment.info,
        validInfo: action.experiment.valid,
      }
    default:
      return state
  }
}
