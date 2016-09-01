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
    this.db = new Database();
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
}
