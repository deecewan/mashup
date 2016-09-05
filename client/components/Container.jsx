import React, { PropTypes } from 'react';
import styles from '../styles/Container';

const Container = props => (
  <div style={styles}>
    {props.children}
  </div>
);

Container.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default Container;
