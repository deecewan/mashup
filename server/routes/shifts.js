import { Router } from 'express';
import Tanda from '../../lib/tanda';

const router = new Router();
const tanda = new Tanda();

router.get('/', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  return tanda.getShifts(req.user)
    .then(json => res.status(200).json(json));
});

export default router;
