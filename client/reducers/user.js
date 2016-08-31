import { Map } from 'immutable';
import * as user from '../actions/user';

const initialState = new Map();

function getLocation(location) {
  const { latitude, longitude } = location.coords;
  return { latitude, longitude };
}

export default function (state = initialState, action) {
  switch (action.type) {
    case user.actions.LOGIN:
      return new Map(action.value);
    case user.actions.LOGOUT:
      return initialState;
    case user.actions.SET_LOCATION:
      return state.set('location', getLocation(action.value));
    default:
      return state;
  }
}
