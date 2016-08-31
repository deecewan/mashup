import React, { PropTypes } from 'react';
import { Card, CardTitle, CardText, Chip } from 'material-ui';
import moment from 'moment';

function getRelativeDay(timeStart, timeEnd) {
  const startDate = new Date(timeStart * 1000);
  const endDate = new Date(timeEnd * 1000);
  const s = moment(startDate);
  const f = moment(endDate);
  let fString = f.format('h:m a');
  if (f.isAfter(s, 'day')) {
    fString = f.calendar();
  }
  return `${s.calendar()} (ending ${fString})`;
}

const ShiftCard = props => (
  <Card>
    <CardTitle title={'Upcoming Shift.'}>
      <Chip backgroundColor={props.department.colour} >
        {props.department.name}
      </Chip>
    </CardTitle>
    <CardText>
      You have a shift at {getRelativeDay(props.start, props.finish)}.
      Your shift is at {props.location.name} ({props.location.latitude}, {props.location.longitude})
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
