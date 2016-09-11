import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardText, MenuItem, SelectField,
  CardActions, Chip, RaisedButton } from 'material-ui';
import moment from 'moment';
import styles from '../styles/ShiftCard';
import { asyncGetTranslink, asyncGetUber } from '../actions/shifts';

class ShiftCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      currentShow: '',
      currentText: '',
    };
    this.renderTranslinkModal = this.renderTranslinkModal.bind(this);
    this.renderUberModal = this.renderUberModal.bind(this);
    this.renderTranslinkOptions = this.renderTranslinkOptions.bind(this);
    this.renderUberOptions = this.renderUberOptions.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps[this.state.currentShow]) {
      const type = this.state.currentShow;
      const name = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
      this.setState({
        currentText: this[`render${name}Options`](nextProps[this.state.currentShow]),
      });
    }
  }

  getLocation() {
    const { location } = this.props;
    if (!location) {
      return (<div>No Location Specified...</div>);
    }
    return (<div>
      Your shift is at {location.name} ({location.latitude}, {location.longitude})
    </div>);
  }

  getRelativeDay() {
    const timeStart = this.props.start;
    const timeEnd = this.props.finish;
    const startDate = new Date(timeStart * 1000);
    const endDate = new Date(timeEnd * 1000);
    const s = moment(startDate);
    const f = moment(endDate);
    let fString = f.format('hh:mm a');
    if (f.isAfter(s, 'day')) {
      fString = f.calendar();
    }
    return `${s.calendar()} (ending ${fString})`;
  }


  handleClick(type) {
    if (type === this.state.currentShow) {
      this.setState({ expanded: false, currentShow: '' });
    } else {
      // swap out the other text
      const name = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
      const fn = this[`render${name}Options`];
      let text = `Loading ${name} journeys...`;
      if (this.props[type]) {
        text = fn(this.props[type]);
      } else {
        this.props[`asyncGet${name}`](this.props);
      }
      this.setState({
        expanded: true,
        currentShow: type,
        currentText: text,
      });
    }
  }

  renderLegs(legs) {
    return legs.map((leg, i) => {
      if (leg.departLocation === false) {
        return <p key={i} dangerouslySetInnerHTML={{ __html: leg.instruction }} />;
      } else if (leg.arriveLocation === false) {
        return <p key={i}>{leg.instruction}</p>;
      }
      return <p key={i}>Go from {leg.departLocation.name} to {leg.arriveLocation.name}.</p>;
    });
  }

  renderTranslinkModal(e, index, value) {
    const option = this.props.translink[value];
    const leaveTime = moment(option.leaveTime);
    const arriveTime = moment(option.arriveTime);
    const goCard = [
      <MenuItem
        key={-2}
      ><b>goCard</b></MenuItem>,
    ];
    const paper = [
      <MenuItem
        key={-3}
        primaryText="Single Paper"
      ><b>Single Paper</b></MenuItem>,
    ];
    option.fares.forEach((fare, i) => {
      const key = i + 5;
      if (fare.Name.includes('go card')) {
        return goCard.push(<MenuItem
          key={key}
          primaryText={`${fare.Name.replace('go card ', '')}: $${fare.Price}`}
        />);
      }
      return paper.push(
        <MenuItem
          key={key}
          primaryText={`${fare.Name.replace('Single paper ', '')}: $${fare.Price}`}
        />
      );
    });
    const fares = [
      <MenuItem key={-1} value={-1} primaryText="Pricing Options" />,
      ...goCard,
      ...paper,
    ];

    const modal = [
      <p key={1}>Duration: {option.duration} minutes.</p>,
      <p key={2}>Departing: {option.departLocation.name}.</p>,
      <p key={3}>You should leave your current location {leaveTime.calendar()}.</p>,
      <p key={4}>You'll arrive at {option.arriveLocation.name} at {arriveTime.calendar()}.</p>,
      <SelectField value={-1}>
        {fares}
      </SelectField>,
      <h4>Legs</h4>,
      this.renderLegs(option.legs),
    ];

    this.props.showModal(modal);
  }

  renderUberModal(e, index, value) {
    const option = this.props.uber[value];
    const duration = option.duration / 60;
    this.props.showModal(([
      <h4 key={1}>Note: This is for the current time only.  Future Uber is not a thing.</h4>,
      <p key={2}>Type: {option.display_name}.</p>,
      <p key={3}>Duration: {duration} minutes.</p>,
      <p key={4}>Estimated Price: {option.estimate}.</p>,
      <p key={5}>Surge (currently): {option.surge_multiplier}.</p>,
    ]));
  }

  renderTranslinkOptions(options) {
    const opts = options.map((option, i) => <MenuItem
      key={i}
      value={i}
      primaryText={`Duration: ${option.duration}`}
    />);
    opts.unshift(<MenuItem key={-1} value={-1} primaryText="Select Translink Journey" />);
    return (
      <SelectField value={-1} onChange={this.renderTranslinkModal}>
        {opts}
      </SelectField>
    );
  }

  renderUberOptions(options) {
    const opts = options.map((option, i) => <MenuItem
      key={i}
      value={i}
      primaryText={option.display_name}
    />);
    opts.unshift(<MenuItem key={-1} value={-1} primaryText="Select Uber Journey" />);
    return (
      <SelectField value={-1} onChange={this.renderUberModal}>
        {opts}
      </SelectField>
    );
  }

  render() {
    return (
      <Card style={styles.base} expanded={this.state.expanded}>
        <CardTitle title={'Upcoming Shift.'}>
          <Chip backgroundColor={this.props.department.colour || '#DDDDDD'} >
            {this.props.department.name || 'No Team'}
          </Chip>
        </CardTitle>
        <CardText>
          You have a shift at {this.getRelativeDay()}.
          {this.getLocation()}
        </CardText>
        <CardText expandable>
          {this.state.currentText}
        </CardText>
        <CardActions style={styles.actions}>
          <RaisedButton
            id="btn-uber"
            label="Uber"
            onTouchTap={() => this.handleClick('uber')}
            primary={this.state.currentShow === 'uber'}
            disabled={!this.props.location}
          />
          <RaisedButton
            id="btn-translink"
            label="Translink"
            onTouchTap={() => this.handleClick('translink')}
            primary={this.state.currentShow === 'translink'}
            disabled={!this.props.location}
          />
        </CardActions>
      </Card>
    );
  }
}

export default connect(state => state.toObject(), { asyncGetTranslink, asyncGetUber })(ShiftCard);

ShiftCard.propTypes = {
  department: PropTypes.object,
  location: PropTypes.object,
  start: PropTypes.number,
  finish: PropTypes.number,
  showModal: PropTypes.func,
  asyncGetTranslink: PropTypes.func,
  asyncGetUber: PropTypes.func,
  translink: PropTypes.array,
  uber: PropTypes.array,
};
