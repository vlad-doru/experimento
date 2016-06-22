import * as API from '../../helpers/api'

import __ from 'lodash';

// constants
const EXAMPLES_EXP = 'ui/simulation/EXAMPLES_EXP';

// Action Creators
export function setExamples(exp, examples) {
  return {
    type: EXAMPLES_EXP,
    exp: exp,
    examples: examples,
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
      console.log(response);
    } catch (e) {
      // TODO: Create a snackbar.
      console.log("Error", e);
    }
  }
}

// Reducer
const initialState = {
  examples: {},
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
    default:
      return state
  }
}
