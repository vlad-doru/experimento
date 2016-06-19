import * as API from '../../helpers/api'
import * as createActions from './create'
import {push, replace} from 'react-router-redux'

// constants
const SAVE_EXPERIMENT = 'ui/repository/SAVE_EXPERIMENT';
const DROP_EXPERIMENT = 'ui/repository/DROP_EXPERIMENT';
const GET_EXPERIMENT_LIST = 'ui/repository/GET_EXPERIMENT_LIST';

// Action Creators
export function saveExperiment(data) {
  return async (dispatch) => {
    try {
      const response = await API.post({
        endpoint: '/api/create',
        data: data,
      })
      console.log("Response", response)
      if (response.ok === true) {
        // Get all of the experiments again.
        dispatch(getExperiments());
        dispatch(createActions.reset())
        dispatch(replace('/'));
      } else {
        // TODO: Call the error snackbar.
      }
    } catch (e) {
      // TODO: Create a snackbar.
      console.log("Error", e);
    }
  }
}

export function dropExperiment(id) {
  return dispatch => {
    // Call the API to drop an experiment.
  }
}

export function getExperiments() {
  //TODO: Add a try catch and a snackbar.
  return async (dispatch) => {
    const data = await API.get({
      endpoint: '/api/list'
    });
    dispatch({
      type: GET_EXPERIMENT_LIST,
      data: data.experiments,
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
      return {
        ...state,
        data: action.data,
      }
    default:
      return state
  }
}
