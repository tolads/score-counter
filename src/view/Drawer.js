import React, { useContext } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { makeStyles } from '@material-ui/core/styles';

import { MenuContext } from './MenuContext';
import pages from './pages';

const useStyles = makeStyles(() => ({
  list: {
    width: 250,
  },
}));

export default function Drawer({ open, setOpen }) {
  const classes = useStyles();
  const { setCurrentPage } = useContext(MenuContext);

  const toggleDrawer = value => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(value);
  };

  return (
    <SwipeableDrawer open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
      <div
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          {pages
            .filter(page => !page.hideFromMenu)
            .map(page => (
              <ListItem key={page.id} button onClick={() => setCurrentPage(page.id)}>
                <ListItemIcon>{page.icon}</ListItemIcon>
                <ListItemText primary={page.label} />
              </ListItem>
            ))}
        </List>
      </div>
    </SwipeableDrawer>
  );
}
