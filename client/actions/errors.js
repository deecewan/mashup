const actions = {
  LOGIN: 'ERROR_LOGIN',
  CONSUME: 'ERROR_CONSUME',
  CLEAR: 'ERROR_CLEAR',
  ADD: 'ERROR_ADD',
};

export {
  actions,
};

// Actions

export function login(value) {
  return {
    value,
    type: actions.LOGIN,
  };
}

export function add(error) {
  return {
    type: actions.ADD,
    value: error,
  };
}

export function consume() {
  return {
    type: actions.CONSUME,
  };
}

export function clear() {
  return {
    type: actions.CLEAR,
  };
}
