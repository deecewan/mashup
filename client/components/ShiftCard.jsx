import React, { PropTypes } from 'react';
import { Card, CardTitle, CardText, Chip } from 'material-ui';
import moment from 'moment';

function getRelativeDay(timeStart, timeEnd) {
  const startDate = new Date(timeStart * 1000);
  const endDate = new Date(timeEnd * 1000);
  const s = moment(startDate);
  const f = moment(endDate);
  let fString = f.format('hh:mm a');
  if (f.isAfter(s, 'day')) {
    fString = f.calendar();
  }
  return `${s.calendar()} (ending ${fString})`;
}

function getLocation(location) {
  if (!location) {
    return (<div>No Location Specified...</div>);
  }
  return (<div>
    Your shift is at {location.name} ({location.latitude}, {location.longitude})
  </div>);
}

const ShiftCard = props => (
  <Card>
    <CardTitle title={'Upcoming Shift.'}>
      <Chip backgroundColor={props.department.colour || '#DDDDDD'} >
        {props.department.name || 'No Team'}
      </Chip>
    </CardTitle>
    <CardText>
      You have a shift at {getRelativeDay(props.start, props.finish)}.
      {getLocation(props.location)}
    </CardText>
  </Card>
);

ShiftCard.propTypes = {
  department: PropTypes.object,
  location: PropTypes.object,
  start: PropTypes.number,
  finish: PropTypes.number,
};

export default ShiftCard;
