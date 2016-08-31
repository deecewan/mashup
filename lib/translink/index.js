import request from 'request-promise';
import moment from 'moment';

let instance = null;

export default class Translink {

  constructor(username, password) {
    if (instance) {
      return instance;
    }
    this.username = username;
    this.password = password;
    this.base64 = new Buffer(`${this.username}:${this.password}`).toString('base64');
    this.auth = {
      Authorization: `Basic ${this.base64}`,
    };
    this.baseUrl = 'https://opia.api.translink.com.au/v2';
    instance = this;
    return instance;
  }

  getLocationId(lat, long) {
    console.log('laaaaat', lat, long);
    return request({
      uri: `${this.baseUrl}/location/rest/suggest`,
      qs: {
        input: `${lat}, ${long}`,
        api_key: 'special-key',
        maxResults: 1,
        filter: 0,
      },
      headers: {
        ...this.auth,
      },
      json: true,
    });
  }

  /**
   * Check if a certain time is offpeak
   * @param {Date|String} time A Javascript Date object, or a ISO8601 String
   */
  static checkOffpeak(time) {
    /*
     Offpeak Times
     weekdays: 8.30am–3.30pm and 7pm–3am the next day
     weekends: all day
     state-wide Queensland gazetted public holidays: all day.
     */
    const d = new Date(time);
    if (d.getDay() === 6 || d.getDay() === 7) { // if it's a weekend
      return true;
    }
    if (d.getUTCHours() >= 9 && d.getUTCHours() <= 2) { // if it's between 9am and 2pm
      return true;
    }
    if (d.getUTCHours() === 8 && d.getUTCMinutes() >= 30) { // if it's 8, and after 8:30
      return true;
    }
    return !!(d.getUTCHours() === 15 && d.getUTCMinutes() <= 30); // if it's 3pm, and before 3:30pm
  }

  /**
   * Get all the journeys for a particular route
   * @param {String} locationIdStart The location to start from
   * @param locationIdEnd The location to go to
   * @param time ISO8601 Date Time string
   */
  getJourneys(locationIdStart, locationIdEnd, time) {
    return request({
      uri: `${this.baseUrl}/travel/rest/plan/${locationIdStart}/${locationIdEnd}`,
      qs: {
        at: time,
        api_key: 'special-key',
        timeMode: 1, // arrive before
        walkSpeed: 1, // normal
        maximumWalkingDistanceM: 1000, // this must be a java programmer
      },
      headers: {
        ...this.auth,
      },
      json: true,
    });
  }

  getStop(stopId) {
    return request({
      uri: `${this.baseUrl}/location/rest/stops`,
      qs: {
        ids: stopId,
        api_key: 'special-key',
      },
      headers: {
        ...this.auth,
      },
      json: true,
    }).then(stops => stops.Stops[0]);
  }


}