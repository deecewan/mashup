import React, { PropTypes } from 'react';
import { Chip, Avatar, FlatButton, Popover, Menu, MenuItem } from 'material-ui';

export default class AvatarChip extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  getUber() {
    if (this.props.Uber) {
      return null;
    }
    return <MenuItem primaryText="Connect Uber" onTouchTap={e => this.handleUber(e)} />;
  }

  getTanda() {
    if (this.props.Tanda) {
      return null;
    }
    return <MenuItem primaryText="Connect Tanda" onTouchTap={e => this.handleTanda(e)} />;
  }

  handleClick(e) {
    e.preventDefault();

    this.setState({
      open: true,
      anchorEl: e.currentTarget,
    });
  }

  handleClose() {
    this.setState({
      open: false,
    });
  }

  handleTanda() {
    window.location.href = '/api/v1/auth/tanda';
    return null;
  }

  handleUber() {
    window.location.href = '/api/v1/auth/uber';
    return null;
  }

  handleLogout() {
    this.setState({
      open: false,
    });
    this.props.asyncLogout();
  }

  render() {
    if (!this.props.name) {
      return (<FlatButton
        style={{ color: '#FFFFFF' }}
        label="Login"
        onTouchTap={this.props.openLogin}
      />);
    }
    return (<Chip onTouchTap={e => this.handleClick(e)} >
      <Avatar src={this.props.photo} />
      {this.props.name}
      <Popover
        open={this.state.open}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        onRequestClose={() => this.handleClose()}
      >
        <Menu>
          {this.getTanda()}
          {this.getUber()}
          <MenuItem primaryText="Logout" onTouchTap={() => this.handleLogout()} />
        </Menu>
      </Popover>
    </Chip>)
      ;
  }
}

AvatarChip.propTypes = {
  name: PropTypes.string,
  photo: PropTypes.string,
  Tanda: PropTypes.bool,
  Uber: PropTypes.bool,
  openLogin: PropTypes.func,
  asyncLogout: PropTypes.func,
};
