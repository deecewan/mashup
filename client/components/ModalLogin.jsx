import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { Dialog, FlatButton, RaisedButton, TextField } from 'material-ui';

import { asyncLogin } from '../actions/user';
import { consume } from '../actions/errors';

const textFieldStyle = {
  width: '100%',
  display: 'block',
};

class ModalLogin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const u = nextProps.user.toObject();
    if (u.id) {
      this.props.hideLogin();
    }
  }

  handleText(e) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  doLogin() {
    this.props.asyncLogin(this.state);
  }

  showError() {
    if (this.props.errors.size > 0) {
      this.props.consume();
    }
  }

  render() {
    this.showError();
    return (
      <Dialog
        open={this.props.showLogin}
        actions={[
          <FlatButton label="Cancel" onTouchTap={this.props.hideLogin} />,
          <RaisedButton label="Log In" onTouchTap={() => this.doLogin()} />,
        ]}
        title="Log in to Mashup"
        onRequestClose={this.props.hideLogin}
        modal
      >
        <TextField
          hintText="Email"
          floatingLabelText="Email"
          style={textFieldStyle}
          id="email"
          onChange={e => this.handleText(e)}
          value={this.state.email}
        />
        <TextField
          hintText="Password"
          floatingLabelText="Password"
          type="password"
          style={textFieldStyle}
          onChange={e => this.handleText(e)}
          id="password"
          value={this.state.password}
        />
      </Dialog>
    );
  }
}

export default connect(state => state.toObject(), { asyncLogin, consume })(ModalLogin);

ModalLogin.propTypes = {
  errors: PropTypes.instanceOf(List),
  showLogin: PropTypes.bool,
  openLogin: PropTypes.func,
  hideLogin: PropTypes.func,
  asyncLogin: PropTypes.func,
  consume: PropTypes.func,
};
