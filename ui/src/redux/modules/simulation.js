import * as API from '../../helpers/api'

import __ from 'lodash';

// constants
const OFFLINE_SIMULATION = 'ui/simulation/OFFLINE_SIMULATION';

// Action Creators
export function setSimulation(simulation) {
  return {
    type: OFFLINE_SIMULATION,
    simulation: simulation,
  }
}

// Reducer
const initialState = {
  simulation: {},
}
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case OFFLINE_SIMULATION:
      return {
        ...state,
        simulation: action.simulation,
      }
    default:
      return state
  }
}
