import passport from 'passport';
import LocalStrategy from 'passport-local';
import Database from '../models';
import { verify } from './hasher';

const db = new Database();

passport.use(new LocalStrategy({
  usernameField: 'email',
}, (email, password, done) => {
  db.models.User.findOne({
    where: { email },
    include: [db.models.Tanda, db.models.Uber],
  }).then(user => {
    if (!user) {
      return done(null, false, { message: 'Incorrect Email Address' });
    }
    return verify(password, user.password)
      .then(() => done(null, user))
      .catch(err =>
        // passwords don't match
        done(null, false, { message: err })
      );
  })
    .catch(done);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.models.User.findOne({
    where: {
      id,
    },
    include: [db.models.Tanda, db.models.Uber],
  })
    .then(user => {
      if (!user) {
        return done(new Error('Failed to find user'));
      }
      return done(null, user);
    })
    .catch(done);
});

export default passport;
