import * as API from '../../helpers/api'

import __ from 'lodash';

// constants
const EXAMPLES_EXP = 'ui/simulation/EXAMPLES_EXP';
const EXAMPLES_RESULTS = 'ui/simulation/EXAMPLES_RESULTS';

// Action Creators
export function setExamples(exp, examples) {
  return {
    type: EXAMPLES_EXP,
    exp: exp,
    examples: examples,
  }
}

export function setResults(results, id) {
  return {
    type: EXAMPLES_RESULTS,
    id: id,
    results: results,
  }
}

export function queryExamples(examples, id) {
  return async (dispatch) => {
    try {
      let entities = __.filter(examples.split(/\r?\n/), (x) => Boolean(x));
      const response = await API.post({
        endpoint: '/api/query',
        data: {
          entities,
          id,
        },
      })
      dispatch(setResults(response, id))
    } catch (e) {
      // TODO: Create a snackbar.
      console.log("Error", e);
    }
  }
}

// Reducer
const initialState = {
  examples: {},
  results: {},
}
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case EXAMPLES_EXP:
      return {
        ...state,
        examples: {
          ...state.examples,
          [action.exp]: action.examples,
        }
      }
    case EXAMPLES_RESULTS:
      return {
        ...state,
        results: {
          ...state.results,
          [action.id]: action.results,
        }
      }
    default:
      return state
  }
}
