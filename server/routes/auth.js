import { Router } from 'express';
import Tanda from '../../lib/tanda';
import Uber from '../../lib/uber';

const router = new Router();
const tanda = new Tanda();
const uber = new Uber();

router.get('/tanda', (req, res, next) => tanda.connectMiddleware(req, res, next));

router.get('/tanda/callback', (req, res, next) => tanda.connectMiddleware(req, res, next),
  (req, res) => {
    // success!
    res.redirect('/');
  });

router.get('/uber', (req, res, next) => uber.connectMiddleware(req, res, next));

router.get('/uber/callback', (req, res, next) => uber.connectMiddleware(req, res, next),
  (req, res) => {
    // success!
    res.redirect('/');
  });

export default router;
