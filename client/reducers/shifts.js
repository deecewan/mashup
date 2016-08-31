import { Record } from 'immutable';
import * as shifts from '../actions/shifts';

const Shift = new Record({
  start: null,
  finish: null,
  department: null,
  location: null,
});

function addShift(state, shift) {
  return state.push(new Shift(shift));
}

export default function (state = shifts.initialState, action) {
  switch (action.type) {
    case shifts.actions.ADD:
      return addShift(state, action.value);
    case shifts.actions.CLEAR:
      return shifts.initialState;
    default:
      return state;
  }
}
