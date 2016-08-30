import { List } from 'immutable';
import * as errors from '../actions/errors';

const initialState = new List();

export default function (state = initialState, action) {
  switch (action.type) {
    case errors.actions.LOGIN:
      return state.push(action.value);
    case errors.actions.CONSUME:
      return state.shift();
    default:
      return state;
  }
}
