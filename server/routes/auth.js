import { Router } from 'express';
import Tanda from '../../lib/tanda';

const router = new Router();
const tanda = new Tanda();

router.get('/tanda', (req, res, next) => tanda.connectMiddleware(req, res, next));

router.get('/tanda/callback', (req, res, next) => tanda.connectMiddleware(req, res, next),
  (req, res) => {
    // success!
    res.redirect('/');
  });

export default router;
