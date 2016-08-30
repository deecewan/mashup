import request from 'request-promise';
import Database from '../../server/models';
import moment from 'moment';

let instance = null;

export default class Tanda {

  constructor() {
    if (instance) {
      return instance;
    }
    this.clientId = process.env.TANDA_ID;
    this.clientSecret = process.env.TANDA_SECRET;
    this.tokenUrl = 'https://my.tanda.co/api/oauth/token';
    this.redirectUrl = `${process.env.SERVER_URL}/api/v1/auth/tanda/callback`;
    this.scopes = [
      'me',
      'department',
      'roster',
      'leave',
      'unavailability',
    ];
    this.connectMiddleware.bind(this);
    this.db = new Database();
    instance = this;
    return instance;
  }

  connectMiddleware(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        message: 'You must be authenticated to connect to Tanda',
      });
    }
    if (req.query && req.query.code) {
      if (!req.user) {
        throw new Error('User Not Found.');
      }
      // make the request on the behalf of the user
      return request({
        uri: this.tokenUrl,
        method: 'POST',
        body: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: req.query.code,
          redirect_uri: this.redirectUrl,
          grant_type: 'authorization_code',
        },
        json: true,
      }).then(json => this.me(json.access_token, json))
        .then(json => Promise.all([
          this.db.models.Tanda.create({
            tandaId: json.id,
            accessToken: json.access_token,
            refreshToken: json.refresh_token,
            expires: Date.now() + (json.expires_in * 1000),
          }),
          req.user.update({ photo: json.photo }),
        ]))
        .then(results => {
          const tanda = results[0]; // always the first one, unless there's an error.
          return tanda.setUser(req.user.id);
        })
        .then(() => next());
    }

    // redirect to request access
    return res.redirect('https://my.tanda.co/api/oauth/authorize?' +
      `scope=${this.scopes.join('+')}&` +
      `client_id=${this.clientId}&` +
      `redirect_uri=${this.redirectUrl}&` +
      'response_type=code');
  }

  refresh(req, res, next) {
    if (!req.user) {
      return next();
    }
    if (!req.user.Tanda) {
      return next();
    }
    // give ourselves 1 second leeway
    if (Date.now() - 1000 < req.user.Tanda.expires) {
      // this is okay
      return next();
    }
    return request({
      uri: this.tokenUrl,
      method: 'POST',
      body: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: req.user.Tanda.refreshToken,
        redirect_uri: this.redirectUrl,
        grant_type: 'refresh_token',
      },
      json: true,
    }).then(json => {
      req.user.Tanda.accessToken = json.access_token;
      req.user.Tanda.refreshToken = json.refresh_token;
      req.user.Tanda.expires = Date.now() + (json.expires_in * 1000);
      return req.user.save();
    })
      .then(() => next());
  }

  me(accessToken, rest) {
    return request({
      uri: 'https://my.tanda.co/api/v2/users/me',
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
      json: true,
    }).then(res => ({
      ...rest,
      ...res,
    }));
  }

  getShifts(user) {
    const from = moment().format('YYYY-MM-DD');
    const to = moment().add(7, 'days').format('YYYY-MM-DD');
    const opts = {
      uri: 'https://my.tanda.co/api/v2/schedules?user_ids=' +
        `${user.Tanda.tandaId}&from=${from}&to=${to}`,
      headers: {
        Authorization: `bearer ${user.Tanda.accessToken}`,
      },
      json: true,
    };
    return request(opts).catch(err => console.log('catch err', err));
  }

}
