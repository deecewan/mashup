import { Router } from 'express';
import Tanda from '../../lib/tanda';
import Uber from '../../lib/uber';
import Translink from '../../lib/translink';

const router = new Router();
const tanda = new Tanda();
const uber = new Uber();
const tl = new Translink(process.env.TRANSLINK_USERNAME, process.env.TRANSLINK_PASSWORD);

router.get('/', (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not logged in.' });
  }
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
    const newShift = {
      id: shift.id,
      start: shift.start,
      finish: shift.finish,
      department: {
        name: 'No Team',
      }
    };
    if (shift.department_id != null) {
      const department = await tanda.getDepartment(req.user, shift.department_id);
      newShift.department = {
        id: department.id,
          name: department.name,
          nickname: department.nickname,
          colour: department.colour,
      };

      const location = await tanda.getLocation(req.user, department.location_id);

      newShift.location = {
        id: location.id,
        name: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
      };
    }

    return newShift;
  });

  return Promise.all(shifts).then(resolvedShifts => {
    return res.status(200).json(resolvedShifts);
  })
    .catch(err => console.log(err));
});

function getTimeFromTranslink(t) {
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
    const journeys = await tl.getJourneys(startLocation, endLocation, startTime);
    const journeyMap = journeys.TravelOptions.Itineraries.map(async function mapJourney(journey) {
      const newJourney = {};
      newJourney.leaveTime = getTimeFromTranslink(journey.StartTime);
      newJourney.duration = journey.DurationMins;
      newJourney.arriveTime = getTimeFromTranslink(journey.EndTime);
      newJourney.fares = journey.Fare.Fares;
      // TODO: Make an array of journey legs.  Where they start, where they end, and what bus num
      const legMap = journey.Legs.map(async function mapLeg(leg) {
        console.log(leg);
        const newLeg = {};
        newLeg.leaveTime = getTimeFromTranslink(leg.DepartureTime);
        newLeg.duration = leg.DurationMins;
        newLeg.arriveTime = getTimeFromTranslink(leg.ArrivalTime);
        newLeg.route = leg.Route;
        newLeg.instruction = leg.Instruction;
        if (leg.FromStopId) {
          const departRaw = await tl.getStop(leg.FromStopId);
          newLeg.departLocation = {
            name: departRaw.Description,
            location: departRaw.Position,
          };
        } else {
          newLeg.departLocation = false;
        }

        if (leg.ToStopId) {
          const arriveRaw = await tl.getStop(leg.ToStopId);
          newLeg.arriveLocation = {
            name: arriveRaw.Description,
            location: arriveRaw.Position,
          };
        } else {
          newLeg.arriveLocation = false;
        }
        return newLeg;
      });
      newJourney.legs = await Promise.all(legMap);
      console.log(newJourney.legs);
      newJourney.departLocation = newJourney.legs[0].arriveLocation;
      newJourney.arriveLocation = newJourney.legs[newJourney.legs.length - 1].departLocation;
      return newJourney;
      });
    const resolvedJourneys = await Promise.all(journeyMap);
    return res.json(resolvedJourneys);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Error processing journey.' });
  }
});

router.get('/journeys/uber', async(req, res) => {
  console.log('getting the endpoint');
  const start_latitude = req.query.currentLocation.latitude;
  const start_longitude = req.query.currentLocation.longitude;
  const end_latitude = req.query.orgLocation.latitude;
  const end_longitude = req.query.orgLocation.longitude;
  const coords = {
    start_latitude,
    start_longitude,
    end_latitude,
    end_longitude,
  };

  console.log('user', req.user);
  uber.getPriceEstimate(req.user, coords)
    .then(json => res.json(json.prices));
});

export default router;
