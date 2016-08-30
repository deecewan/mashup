import { List } from 'immutable';

const actions = {
  ADD: 'SHIFTS_ADD',
  CLEAR: 'SHIFTS_CLEAR',
};


const initialState = new List();

export {
  initialState,
  actions,
};

// Actions

export function add(shift) {
  return {
    type: actions.ADD,
    value: shift,
  };
}

export function getShifts() {
  return dispatch => {
    fetch('/api/v1/shifts', {
      credentials: 'include',
    }).then(res => {
      if (res.ok) {
        return res.json();
      }
      return null;
    }).then(shifts => {
      shifts.forEach(shift => dispatch(add(shift)));
    });
  };
}

export function clear() {
  return {
    type: actions.CLEAR,
  };
}
