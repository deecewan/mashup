import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import Content from './Content';
import Header from './Header';
import ModalLogin from './ModalLogin';
import Index from './Index';
import Container from './Container';
import MenuDrawer from './MenuDrawer';
import * as user from '../actions/user';
// import * as errors from '../actions/errors';
import * as shifts from '../actions/shifts';

class App extends React.Component {

  static showChromeWarning() {
    const ret = [];
    if (!('chrome' in window)) {
      ret.push(<p key={1} className="chrome-warning">
        Sorry, we only support <a href="http://chrome.google.com">Chrome</a>.
      </p>);
    }
    if (navigator.platform !== 'Android') {
      ret.push(<p key={2} className="android-warning">
        For best results, we recommend an Android phone.
      </p>);
    }
    return ret;
  }

  constructor(props) {
    super(props);
    this.state = {
      showLogin: false,
      showDrawer: false,
    };
    this.openLogin = this.openLogin.bind(this);
    this.hideLogin = this.hideLogin.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
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

  toggleDrawer(open) {
    let show = !this.state.showDrawer;
    if (open != null) {
      show = open;
    }
    this.setState({
      showDrawer: show,
    });
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
        <MenuDrawer drawerOpen={this.state.showDrawer} toggleOpen={this.toggleDrawer} />
        <Header {...this.props} openLogin={this.openLogin} toggleDrawer={this.toggleDrawer} />
        <Container>
          {App.showChromeWarning()}
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
