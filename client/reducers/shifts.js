import { Record } from 'immutable';
import * as shifts from '../actions/shifts';

const Shift = new Record({
  id: null,
  start: null,
  finish: null,
  department: null,
  location: null,
  translink: null,
  uber: null,
});

function addShift(state, shift) {
  return state.push(new Shift(shift));
}

function updateShift(state, shift) {
  const update = new Shift(shift);
  const id = shift.id;
  const index = state.findKey(s => s.id === id);
  return state.set(index, update);
}

export default function (state = shifts.initialState, action) {
  switch (action.type) {
    case shifts.actions.ADD:
      return addShift(state, action.value);
    case shifts.actions.CLEAR:
      return shifts.initialState;
    case shifts.actions.UPDATE_SHIFT:
      return updateShift(state, action.value);
    default:
      return state;
  }
}
