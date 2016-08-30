import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { AppBar } from 'material-ui';
import AvatarChip from './AvatarChip';
import * as user from '../actions/user';

const Header = props => (
  <AppBar
    title="Mashup"
    iconStyleRight={{
      marginTop: '0',
      alignSelf: 'center',
    }}
    iconElementRight={
      <AvatarChip {...props} />
    }
  />
);

Header.propTypes = {
  name: PropTypes.string,
};

const mapStateToProps = state => state.get('user').toObject();

export default connect(mapStateToProps, user)(Header);
