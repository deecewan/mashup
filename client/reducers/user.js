import { Map } from 'immutable';
import * as user from '../actions/user';

const initialState = new Map();

export default function (state = initialState, action) {
  switch (action.type) {
    case user.actions.LOGIN:
      return new Map(action.value);
    case user.actions.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
