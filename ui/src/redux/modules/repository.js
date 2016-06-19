import * as API from '../../helpers/api'
import * as createActions from './create'
import {push, replace} from 'react-router-redux'

import __ from 'lodash';

// constants
const SAVE_EXPERIMENT = 'ui/repository/SAVE_EXPERIMENT';
const DROP_EXPERIMENT = 'ui/repository/DROP_EXPERIMENT';
const GET_EXPERIMENT_LIST = 'ui/repository/GET_EXPERIMENT_LIST';
const SEARCH_EXPERIMENT_LIST = 'ui/repository/SEARCH_EXPERIMENT_LIST';

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
  return async (dispatch) => {
    // TODO: Try/catch + snackbar.
    const response = await API.post({
      endpoint: '/api/drop',
      data: {
        info: {
          id: id,
        }
      },
    })
    if (response.ok === true) {
      // Get all of the experiments again.
      dispatch(getExperiments());
      dispatch(createActions.reset())
      dispatch(replace('/'));
    }
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

export function searchExperiments(term) {
  return {
    type: SEARCH_EXPERIMENT_LIST,
    term: term,
  }
}

function filterData(data, term) {
  let result = []
  __.map(Object.keys(data).sort(), (key) => {
    if (!term) {
      result.push(data[key]);
      return;
    }
    if (key.toLowerCase().indexOf(term.toLowerCase()) >= 0) {
      result.push(data[key]);
    }
  })
  return result;
}

// Reducer
const initialState = {
  data: {},
  list: [],
  term: '',
}
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_EXPERIMENT_LIST:
      return {
        ...state,
        data: action.data,
        list: filterData(action.data, state.term),
      }
    case SEARCH_EXPERIMENT_LIST:
      return {
        ...state,
        term: action.term,
        list: filterData(state.data, action.term),
      }
    default:
      return state
  }
}
