import React, { PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { Dialog, RaisedButton } from 'material-ui';

import ShiftCard from './ShiftCard';
import Map from './Map';
import { asyncSetLocation } from '../actions/user';

class Content extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modal: '',
      work: null,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.setWork = this.setWork.bind(this);
  }

  componentWillMount() {
    this.props.asyncSetLocation();
  }

  getShiftCards() {
    const cards = [];
    this.props.shifts.forEach((shift, i) =>
      cards.push(<ShiftCard
        key={i}
        {...shift.toObject()}
        showModal={this.showModal}
        setWork={this.setWork}
      />));
    return cards;
  }

  setWork(work) {
    this.setState({ work });
  }

  hideModal() {
    this.setState({ showModal: false });
  }

  showModal(modal) {
    this.setState({ modal, showModal: true });
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.state.showModal}
          actions={[
            <RaisedButton label="Close" onTouchTap={this.hideModal} />,
          ]}
          title="Journey Details"
          onRequestClose={this.hideModal}
        >
          {this.state.modal}
        </Dialog>
        <h2>Welcome, {this.props.user.name}.</h2>
        <p>Your Tanda account is {this.props.user.Tanda ? 'Connected' : 'Not Yet Connected'}.</p>
        <Map location={this.props.user.location} work={this.state.work} />
        {this.getShiftCards()}
      </div>
    );
  }
}

Content.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    Tanda: PropTypes.bool,
    location: PropTypes.object,
  }),
  shifts: PropTypes.array,
  asyncSetLocation: PropTypes.func,
};

const mapStateToProps = state => ({
  user: state.get('user').toObject(),
  shifts: state.get('shifts').toArray(),
});

const Component = new Radium(Content);

export default connect(mapStateToProps, { asyncSetLocation })(Component);
