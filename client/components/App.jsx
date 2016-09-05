import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import Content from './Content';
import Header from './Header';
import ModalLogin from './ModalLogin';
import Index from './Index';
import Container from './Container';
import * as user from '../actions/user';
// import * as errors from '../actions/errors';
import * as shifts from '../actions/shifts';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showLogin: false,
    };
    this.openLogin = this.openLogin.bind(this);
    this.hideLogin = this.hideLogin.bind(this);
  }

  componentWillMount() {
    this.props.actions.user.restore();
    this.props.actions.shifts.getShifts();
    this.props.actions.user.getLocation();
  }

  openLogin() {
    this.setState({
      showLogin: true,
    });
  }

  hideLogin() {
    this.setState({
      showLogin: false,
    });
  }

  selectiveRender() {
    if (this.props.user.get('name')) {
      return <Content />;
    }

    return <Index />;
  }

  render() {
    return (
      <div>
        <ModalLogin
          showLogin={this.state.showLogin}
          openLogin={this.openLogin}
          hideLogin={this.hideLogin}
          {...this.props}
        />
        <Header {...this.props} openLogin={this.openLogin} />
        <Container>
          {this.selectiveRender()}
        </Container>
      </div>
    );
  }
}

App.propTypes = {
  user: PropTypes.instanceOf(Map),
  actions: PropTypes.object,
};

const mapDispatch = dispatch => ({
  actions: {
    user: {
      restore: () => dispatch(user.restore()),
      getLocation: () => dispatch(user.asyncSetLocation()),
    },
    shifts: {
      getShifts: () => dispatch(shifts.getShifts()),
    },
  },
});

export default connect(state => state.toObject(), mapDispatch)(App);
