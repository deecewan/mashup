import { Router } from 'express';
import Tanda from '../../lib/tanda';
import Uber from '../../lib/uber';
import Translink from '../../lib/translink';

const router = new Router();
const tanda = new Tanda();
const uber = new Uber();
const tl = new Translink(process.env.TRANSLINK_USERNAME, process.env.TRANSLINK_PASSWORD);

router.get('/', (req, res, next) => {
  if (req.user.Tanda) {
    return next();
  }
  return res.status(400).json({ message: 'Not connected to Tanda' });
}, async(req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  let shifts = await tanda.getShifts(req.user);
  shifts = shifts.map(async shift => {
    const department = await tanda.getDepartment(req.user, shift.department_id);
    console.log(department);
    const location = await tanda.getLocation(req.user, department.location_id);
    return {
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
      }
    };
  });

  return Promise.all(shifts).then(resolvedShifts => {
    return res.status(200).json(resolvedShifts);
  });
});

function getTimeFromJourney(t) {
  const x = t.match(/\/Date\((\d*)\+.*\)/);
  return new Date(parseInt(x[1], 10));
}

router.get('/journeys/translink', async(req, res) => {
  const currentLocation = req.query.currentLocation;
  const orgLocation = req.query.orgLocation;
  const startTime = req.query.startTime;
  try {
    const startLocation = (await tl.getLocationId(currentLocation.latitude,
      currentLocation.longitude)).Suggestions[0].Id;
    const endLocation = (await tl.getLocationId(orgLocation.latitude,
      orgLocation.longitude)).Suggestions[0].Id;
    const journeys = (await tl.getJourneys(startLocation, endLocation, startTime))
      .TravelOptions.Itineraries.map(async function mapJourney(journey) {
        const newJourney = {};
        newJourney.leaveTime = getTimeFromJourney(journey.FirstDepartureTime);
        newJourney.duration = journey.DurationMins;
        newJourney.arriveTime = getTimeFromJourney(journey.EndTime);
        const departRaw = await tl.getStop(journey.Legs[0].ToStopId);
        newJourney.departLocation = {
          name: departRaw.Description,
          location: departRaw.Position,
        };
        const arriveRaw = await
          tl.getStop(journey.Legs[journey.Legs.length - 1].FromStopId);
        newJourney.arriveLocation = {
          name: arriveRaw.Description,
          location: arriveRaw.Position,
        };
        // TODO: Make an array of journey legs.  Where they start, where they end, and what bus num
        return newJourney;
      });
    const resolvedJourneys = await Promise.all(journeys);
    return res.json(resolvedJourneys);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Error processing journey.' });
  }
});

router.get('/journeys/uber', async(req, res) => {
  const coords = {
    start_latitude: req.query.start_latitude,
    start_longitude: req.query.start_longitude,
    end_latitude: req.query.end_latitude,
    end_longitude: req.query.end_longitude,
  };

  uber.getPriceEstimate(req.user, coords)
    .then(json => res.json(json));
});

export default router;
