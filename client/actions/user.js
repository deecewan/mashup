import { Map } from 'immutable';
import * as errors from './errors';
import * as shifts from './shifts';

const actions = {
  LOGIN: 'USER_LOGIN',
  LOGOUT: 'USER_LOGOUT',
  ASYNC_LOGIN: 'USER_ASYNC_LOGIN',
  ASYNC_LOGOUT: 'USER_ASYNC_LOGOUT',
  ASYNC_RESTORE: 'USER_ASYNC_RESTORE',
  SET_LOCATION: 'USER_SET_LOCATION',
};

const initialState = new Map({
  name: null,
  email: null,
});

export {
  initialState,
  actions,
};

// Actions

export function login(user) {
  return {
    type: actions.LOGIN,
    value: user,
  };
}

export function asyncLogin(request) {
  return dispatch =>
    fetch('/api/v1/user/login', {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }).then(res => {
      if (!res.ok) {
        return res.json()
          .then(error => dispatch(errors.login(error)));
      }
      return res.json()
        .then(u => {
          dispatch(login(u));
          dispatch(shifts.getShifts());
        });
    });
}

export function asyncSignup(request) {
  return dispatch =>
    fetch('/api/v1/user/signup', {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }).then(res => {
      if (!res.ok) {
        return res.json()
          .then(error => dispatch(errors.login(error)));
      }
      return res.json()
        .then(u => {
          dispatch(login(u));
          dispatch(shifts.getShifts());
        });
    });
}

export function logout() {
  return {
    type: actions.LOGOUT,
  };
}

export function asyncLogout() {
  return dispatch => {
    fetch('/api/v1/user/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then(res => {
        if (res.ok) {
          dispatch(logout());
          dispatch(shifts.clear());
          dispatch(errors.clear());
        }
      });
  };
}

export function restore() {
  return dispatch => {
    fetch('/api/v1/user/me', {
      credentials: 'include',
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        return null;
      })
      .then(user => {
        if (user) {
          dispatch(login(user));
        }
      });
  };
}

export function setLocation(location) {
  return {
    type: actions.SET_LOCATION,
    value: location,
  };
}

export function asyncSetLocation() {
  return dispatch => {
    navigator.geolocation.getCurrentPosition(location => {
      dispatch(setLocation(location));
    }, null, {
      enableHighAccuracy: true, // get a better read on location
    });
  };
}
