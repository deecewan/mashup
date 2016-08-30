import { Router } from 'express';
import Database from '../models';
import passport from '../lib/passport';
import hash from '../../lib/hasher';

const db = new Database();
const router = new Router();

router.get('/me', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  const user = req.user.toJSON();
  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  if (user.Tanda) {
    user.Tanda = true;
  }
  return res.status(200).json(user);
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    console.log(info);
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json(info);
    }
    return req.logIn(user, loginErr => {
      if (loginErr) {
        return next(err);
      }
      return res.status(200).json(user);
    });
  })(req, res, next);
});

router.post('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
})

router.post('/signup', (req, res) => {
  if (req.user) {
    return res.status(400).json({ message: 'You are already logged in.' });
  }
  if (!req.body) {
    return res.status(400).json({ message: 'You must provide user details' });
  }
  if (!req.body.name) {
    return res.status(400).json({ message: 'You must provide a name' });
  }
  if (!req.body.email) {
    return res.status(400).json({ message: 'You must provide an email address' });
  }
  if (!req.body.password) {
    return res.status(400).json({ message: 'You must provide a password' });
  }

  // create the user
  return hash(req.body.password)
    .then(password => db.models.User.create({
      password,
      name: req.body.name,
      email: req.body.email,
    }))
    .then(user => {
      const newUser = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
      return req.login(user, err => {
        if (err) {
          return res.status(500).json({
            message: 'Error logging in.  You\'ll need to log in manually',
          });
        }
        return res.status(200).json(newUser);
      });
    })
    .catch(err => {
      if (err.message === 'Validation error') {
        console.log(err.errors);
        return res.status(400).json({
          message: 'Error creating user.',
          error: err.errors.map(error => ({
            message: error.message.charAt(0).toUpperCase() + error.message.slice(1),
            field: error.path,
          }))[0],
        });
      }
      console.log(err.message);
      return res.sendStatus(500);
    });
});

export default router;