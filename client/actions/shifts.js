import { List } from 'immutable';
import moment from 'moment';

const actions = {
  ADD: 'SHIFTS_ADD',
  CLEAR: 'SHIFTS_CLEAR',
  UPDATE_SHIFT: 'SHIFTS_UPDATE',
};

const initialState = new List();

const mutex = {
  translink: false,
  uber: false,
};

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
      if (shifts) {
        shifts.forEach(shift => dispatch(add(shift)));
      }
    });
  };
}

export function updateShift(shift) {
  return {
    type: actions.UPDATE_SHIFT,
    value: shift,
  };
}

export function asyncGetTranslink(shift) {
  return (dispatch, getState) => {
    if (shift.translink || mutex.translink) {
      return shift;
    }
    mutex.translink = true;
    const user = getState().toObject().user.toObject();
    const startTime = moment(shift.start * 1000).format().replace('+', '%2B'); // url-encoded
    const q = `currentLocation[latitude]=${user.location.latitude}` +
      `&currentLocation[longitude]=${user.location.longitude}` +
      `&orgLocation[latitude]=${shift.location.latitude}` +
      `&orgLocation[longitude]=${shift.location.longitude}` +
      `&startTime=${startTime}`;

    if (!user.location.latitude) {
      return dispatch(console.error({ message: 'Current location not found.  Please make sure' +
      ' you have location enabled for this application.' }));
    }

    return fetch(`/api/v1/shifts/journeys/translink?${q}`)
      .then(res => {
        if (!res.ok) {
          return res.json()
            .then(error => console.error(error));
        }
        return res.json()
          .then(json => Object.assign({}, shift, { translink: json }))
          .then(journeyedShift => dispatch(updateShift(journeyedShift)))
          .then(() => { mutex.translink = false; });
      });
  };
}


export function asyncGetUber(shift) {
  return (dispatch, getState) => {
    if (shift.uber || mutex.uber) {
      return shift;
    }
    mutex.uber = true;
    const user = getState().toObject().user.toObject();
    const q = `currentLocation[latitude]=${user.location.latitude}` +
      `&currentLocation[longitude]=${user.location.longitude}` +
      `&orgLocation[latitude]=${shift.location.latitude}` +
      `&orgLocation[longitude]=${shift.location.longitude}`;

    if (!user.location.latitude) {
      return dispatch(console.error({ message: 'Current location not found.  Please make sure' +
      ' you have location enabled for this application.' }));
    }

    return fetch(`/api/v1/shifts/journeys/uber?${q}`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          return res.json()
            .then(error => dispatch(console.error(error)));
        }
        return res.json()
          .then(json => Object.assign({}, shift, { uber: json }))
          .then(journeyedShift => dispatch(updateShift(journeyedShift)))
          .then(() => { mutex.uber = false; });
      });
  };
}


export function clear() {
  return {
    type: actions.CLEAR,
  };
}
