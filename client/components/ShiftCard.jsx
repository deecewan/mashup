import React, { PropTypes } from 'react';
import { Card, CardTitle, CardText } from 'material-ui';

const ShiftCard = props => (
  <Card>
    <CardTitle title={`Shift in ${props.department_id}.`} />
    <CardText>
      You have a shift at {props.start}, and it ends at {props.finish}.
    </CardText>
  </Card>
);

ShiftCard.propTypes = {
  department_id: PropTypes.number,
  start: PropTypes.number,
  finish: PropTypes.number,
};

export default ShiftCard;
