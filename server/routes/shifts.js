import { Router } from 'express';
import Tanda from '../../lib/tanda';
import Translink from '../../lib/translink';

const router = new Router();
const tanda = new Tanda();
const tl = new Translink(process.env.TRANSLINK_USERNAME, process.env.TRANSLINK_PASSWORD);

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

router.get('/journeys', async (req, res) => {
  console.log(req.query);
  const currentLocation = req.query.currentLocation;
  const orgLocation = req.query.orgLocation;
  const startTime = req.query.startTime;
  try {
    const startLocation = (await tl.getLocationId(currentLocation.latitude,
      currentLocation.longitude)).Suggestions[0].Id;
    const endLocation = (await tl.getLocationId(orgLocation.latitude,
      orgLocation.longitude)).Suggestions[0].Id;
    const journeys = await tl.getJourneys(startLocation, endLocation, startTime);
    return res.json(journeys);
  } catch (e) {
    return res.json(e);
  }
});

export default router;
