// Constants
const EXPERIMENT = 'ui/create/EXPERIMENT';
const VARIABLES = 'ui/create/VARIABLES';
const GROUPS = 'ui/create/GROUPS';
const WHITELIST = 'ui/create/WHITELIST';
const STEP_INDEX = 'ui/create/STEP_INDEX';
const RESET = 'ui/create/RESET';

// Action Creators
export function setExperiment(experiment) {
  return {
    type: EXPERIMENT,
    experiment: experiment,
  }
}

export function setVariables(vars) {
  return {
    type: VARIABLES,
    vars: vars,
  }
}

export function setGroups(groups) {
  return {
    type: GROUPS,
    groups: groups,
  }
}

export function setWhitelist(whitelist) {
  return {
    type: WHITELIST,
    whitelist: whitelist,
  }
}

export function setStep(index) {
  return {
    type: STEP_INDEX,
    index: index,
  }
}

export function reset() {
  return {
    type: RESET,
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
    case VARIABLES:
      return {
        ...state,
        variables: action.vars.variables,
        validVariables: action.vars.valid,
        variableInput: action.vars.variableInput,
      }
    case GROUPS:
      return {
        ...state,
        groups: action.groups.groups,
        values: action.groups.values,
        validGroups: action.groups.valid,
        groupInput: action.groups.groupInput,
      }
    case WHITELIST:
      return {
        ...state,
        whitelist: action.whitelist.whitelist,
        whitelistInput: action.whitelist.whitelistInput,
        whitelistGroup: action.whitelist.whitelistGroup
      }
    case STEP_INDEX:
      return {
        ...state,
        stepIndex: action.index,
      }
    case RESET: {
      return {}
    }
    default:
      return state
  }
}
