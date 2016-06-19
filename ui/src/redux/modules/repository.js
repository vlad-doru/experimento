import fetch from 'isomorphic-fetch';

// constants
const SAVE_EXPERIMENT = 'ui/repository/SAVE_EXPERIMENT';
const DROP_EXPERIMENT = 'ui/repository/DROP_EXPERIMENT';
const GET_EXPERIMENT_LIST = 'ui/repository/GET_EXPERIMENT_LIST';

// Action Creators
export function saveExperiment(data) {
  return dispatch => {
    // Call the API to save an experiment.
  }
}

export function dropExperiment(id) {
  return dispatch => {
    // Call the API to drop an experiment.
  }
}

export function getExperiments() {
  return async (dispatch) => {
    const response = await fetch('/api/list');
    const data = await response.json();
    dispatch({
      type: GET_EXPERIMENT_LIST,
      data: data
    })
  }
}

// Reducer
const initialState = {
  data: {},
}
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_EXPERIMENT_LIST:
      console.log("AMAZING");
      return {
        ...state,
        data: action.data,
      }
    default:
      return state
  }
}
