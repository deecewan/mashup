import { Router } from 'express';
import Tanda from '../../lib/tanda';

const router = new Router();
const tanda = new Tanda();

router.get('/', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  return tanda.getShifts(req.user)
    .then(shifts => shifts.map(
      shift => tanda.getDepartment(req.user, shift.department_id)
          .then(department =>
            tanda.getLocation(req.user, department.location_id)
              .then(location => ({
                start: shift.start,
                finish: shift.finish,
                department: {
                  id: department.id,
                  name: department.name,
                  nickname: department.nickname,
                  colour: department.colour,
                },
                location: {
                  id: location.id,
                  name: location.name,
                  latitude: location.latitude,
                  longitude: location.longitude,
                },
              }))
          )
      ))
    .then(shifts => Promise.all(shifts))
    .then(shifts => res.status(200).json(shifts));
});

export default router;
