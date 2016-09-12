import React from 'react';

export default class Tooltip extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      label: props.label,
      location: props.location || 'left',
      show: false,
    };
    this.onHover = this.onHover.bind(this);
    this.offHover = this.offHover.bind(this);
  }

  onHover() {
    this.setState({ show: true });
  }

  getClass() {
    let classes = 'tooltip';
    if (this.state.show) {
      classes += ' fade-in';
    }
    return classes;
  }

  getLocation() {
    switch (this.state.location) {
      case 'top':
        return {
          left: 0,
          marginTop: '-25%',
        };
      case 'right':
        return {
          top: '-100%',
          right: '-110%',
        };
      case 'bottom':
        return {
          left: 0,
          bottom: '-25%',
        };
      case 'left':
      default:
        return {
          top: '-100%',
          left: '-120%',
        };
    }
  }

  offHover() {
    this.setState({ show: false });
  }

  render() {
    return (
      <span
        style={{ position: 'relative' }}
        onMouseEnter={this.onHover}
        onMouseLeave={this.offHover}
      >
        <p
          className={this.getClass()}
          key={1}
          style={this.getLocation()}
        >
          {this.props.label}
        </p>
        {this.props.children}
      </span>
    );
  }
}

Tooltip.propTypes = {
  label: React.PropTypes.string,
  location: React.PropTypes.string,
  children: React.PropTypes.node,
};
