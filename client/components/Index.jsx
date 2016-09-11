import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { TextField, RaisedButton } from 'material-ui';
import styles from '../styles/TextField';
import { asyncLogin, asyncSignup } from '../actions/user';


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      login: {
        email: '',
        password: '',
      },
      signup: {
        name: '',
        email: '',
        password: '',
        confirm: '',
      },
    };
  }

  updateError() {
    if (this.state.signup.confirm !== '' &&
      this.state.signup.password !== this.state.signup.confirm) {
      return this.setState({ error: 'Please enter matching passwords' });
    }
    return this.setState({ error: '' });
  }

  handleChange(e) {
    this.setState({ error: '' });
    const [type, field] = e.target.id.split('-');
    const previousState = this.state[type];
    previousState[field] = e.target.value;
    this.setState(previousState);
  }

  doLogin(e) {
    e.preventDefault();
    const { email, password } = this.state.login;
    this.props.asyncLogin({ email, password });
  }

  doSignup() {
    const { name, email, password } = this.state.signup;
    if (this.state.error) {
      return;
    }
    this.props.asyncSignup({ name, email, password });
  }

  render() {
    return (
      <div>
        <h1>Tanda-Uber-Translink</h1>
        <h4>Find the best public transport routes to work and back.</h4>

        <h3>Login</h3>
        <form onSubmit={e => this.doLogin(e)}>
          <TextField
            style={styles}
            hintText="Email Address"
            floatingLabelText="Email Address"
            onChange={e => this.handleChange(e)}
            value={this.state.login.email}
            id="login-email"
          />
          <TextField
            style={styles}
            hintText="Password"
            type="password"
            floatingLabelText="Password"
            onChange={e => this.handleChange(e)}
            value={this.state.login.password}
            id="login-password"
          />
          <RaisedButton label="Login" type="submit" fullWidth primary />
        </form>
        <h3>Signup</h3>
        <TextField
          style={styles}
          hintText="Name"
          floatingLabelText="Name"
          onChange={e => this.handleChange(e)}
          value={this.state.signup.name}
          id="signup-name"
        />
        <TextField
          style={styles}
          hintText="Email Address"
          floatingLabelText="Email Address"
          onChange={e => this.handleChange(e)}
          value={this.state.signup.email}
          id="signup-email"
        />
        <TextField
          style={styles}
          hintText="Password"
          type="password"
          floatingLabelText="Password"
          onChange={e => this.handleChange(e)}
          value={this.state.signup.password}
          id="signup-password"
        />
        <TextField
          style={styles}
          hintText="Confirm"
          type="password"
          floatingLabelText="Confirm"
          onChange={e => this.handleChange(e)}
          value={this.state.signup.confirm}
          errorText={this.state.error}
          onBlur={() => this.updateError()}
          id="signup-confirm"
        />
        <RaisedButton label="Signup" fullWidth primary onClick={() => this.doSignup()} />
      </div>
    );
  }
}

export default connect(state => state.toObject(), { asyncLogin, asyncSignup })(Index);

Index.propTypes = {
  asyncLogin: PropTypes.func,
  asyncSignup: PropTypes.func,
};
