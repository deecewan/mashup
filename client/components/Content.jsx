import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import ShiftCard from './ShiftCard';

function getShiftCards(shifts) {
  const cards = [];
  shifts.forEach((shift, i) => cards.push(<ShiftCard key={i} {...shift.toObject()} />));
  return cards;
}

const Content = props => (
  <div>
    <p>Welcome, {props.user.name}.</p>
    <p>Your Tanda account is {props.user.Tanda ? 'Connected' : 'Not Yet Connected'}.</p>
    {props.user.location
      ? `Your location is (${props.user.location.latitude}, ${props.user.location.longitude})`
      : 'Getting Location...'
    }
    {getShiftCards(props.shifts)}
  </div>
);

Content.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    Tanda: PropTypes.bool,
    location: PropTypes.object,
  }),
  shifts: PropTypes.array,
};

const mapStateToProps = state => ({
  user: state.get('user').toObject(),
  shifts: state.get('shifts').toArray(),
});

export default connect(mapStateToProps)(Content);
