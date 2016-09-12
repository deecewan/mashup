import React from 'react';
import GoogleMap from 'google-map-react';
import CircularProgress from 'material-ui/CircularProgress';

const styles = {
  width: 40,
  height: 40,
  backgroundColor: 'rgba(0,0,0,0.7)',
  borderRadius: '100% 100% 100% 0',
  transform: 'rotateZ(-45deg)',
  textAlign: 'center',
  color: '#FFF',
  border: '2px solid rgb(0, 188, 212)',
};

const innerStyles = {
  transform: 'rotateZ(45deg)',
  marginRight: '-27%',
  paddingTop: '32%',
  fontSize: '1.1rem',
};

const Map = props => {
  if (!props.location) {
    return <div><CircularProgress size={0.5} />Loading location...</div>;
  }
  return (
    <div style={{ marginBottom: 10, height: 200 }}>
      <GoogleMap
        bootstrapURLKeys={{ key: 'AIzaSyDcCi50tOqIBU9pcoE6x41S-Z6gYsGkXZ4' }}
        center={{
          lat: props.location.latitude || null,
          lng: props.location.longitude || null,
        }}
        zoom={props.work ? 10 : 18}
      >
        <div style={styles} lat={props.location.latitude} lng={props.location.longitude}>
          <div style={innerStyles}>
            You
          </div>
        </div>
        {props.work ?
          <div style={styles} lat={props.work.latitude} lng={props.work.longitude}>
            <div style={innerStyles} />
          </div>
        : null}
      </GoogleMap>
    </div>);
};

Map.propTypes = {
  location: React.PropTypes.object,
  work: React.PropTypes.node,
};

export default Map;
