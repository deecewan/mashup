import request from 'request-promise';
import Database from '../../server/models';

let instance = null;

export default class Uber {
  constructor() {
    if (instance) {
      return instance;
    }
    this.clientId = process.env.UBER_ID;
    this.clientSecret = process.env.UBER_SECRET;
    this.serverToken = process.env.UBER_SERVER_TOKEN;
    this.redirectUrl = `${process.env.SERVER_URL}/api/v1/auth/uber/callback`;
    this.tokenUrl = 'https://login.uber.com/oauth/v2/token';
    this.baseUrl = 'https://api.uber.com';
    this.db = new Database();
    this.connectMiddleware = this.connectMiddleware.bind(this);
    instance = this;
    return instance;
  }

  connectMiddleware(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        message: 'You must be authenticated to connect to Uber',
      });
    }
    if (req.query.code) {
      // we're receiving a code from uber
      return request({
        uri: this.tokenUrl,
        method: 'POST',
        form: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: req.query.code,
          redirect_uri: this.redirectUrl,
          grant_type: 'authorization_code',
        },
        json: true,
      })
        .then(json => {
          console.log(json);
          return this.db.models.Uber.create({
            accessToken: json.access_token,
            refreshToken: json.refresh_token,
            expires: Date.now() + (json.expires_in * 1000),
          });
        })
        .then(uber => uber.setUser(req.user.id))
        .then(() => next());
    }
    return res.redirect('https://login.uber.com/oauth/v2/authorize?' +
      `client_id=${this.clientId}&response_type=code&scope=places request&` +
      `redirect_uri=${this.redirectUrl}`);
  }

  refresh(req, res, next) {
    if (!req.user) {
      return next();
    }
    if (!req.user.Uber) {
      return next();
    }
    // give ourselves 1 second leeway
    if (Date.now() - 1000 < req.user.Uber.expires) {
      // this is okay
      return next();
    }
    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: req.user.Uber.refreshToken,
      redirect_uri: this.redirectUrl,
      grant_type: 'refresh_token',
    };
    return request({
      uri: this.tokenUrl,
      method: 'POST',
      form: body,
      json: true,
    }).then(json =>
      req.user.Uber.updateAttributes({
        accessToken: json.access_token,
        refreshToken: json.refresh_token,
        expires: Date.now() + (json.expires_in * 1000),
      }))
      .then(() => {
        // refresh the logged in user.
        req.login(req.user, err => {
          if (err) {
            return next(err);
          }
          return next();
        });
      });
  }

  getAuthHeaders(uber) {
    if (!uber) {
      return {
        Authorization: `Token ${this.serverToken}`,
      };
    }
    return {
      Authorization: `Bearer ${uber.accessToken}`,
    };
  }

  getPriceEstimate(user, coords) {
    console.log(user);
    console.log(coords);
    const { start_latitude, start_longitude, end_latitude, end_longitude } = coords;
    const headers = this.getAuthHeaders(user.Uber);

    return request({
      uri: `${this.baseUrl}/v1/estimates/price`,
      qs: {
        start_latitude,
        start_longitude,
        end_latitude,
        end_longitude,
      },
      headers,
      json: true,
    }).then(json => { console.log(json); return json; });
  }
}
