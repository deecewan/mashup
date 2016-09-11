import React from 'react';
import { Drawer, MenuItem, Toggle } from 'material-ui';

const MenuDrawer = props =>
  <Drawer
    docked={false}
    open={props.drawerOpen}
    onRequestChange={open => props.toggleOpen(open)}
  >
    <MenuItem><b>Mashup</b></MenuItem>
    <MenuItem>
      <Toggle label="Push Notifications" disabled />
    </MenuItem>
  </Drawer>;


MenuDrawer.propTypes = {
  drawerOpen: React.PropTypes.bool,
  toggleOpen: React.PropTypes.func,
};

export default MenuDrawer;
