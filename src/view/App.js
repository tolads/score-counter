import React, { useContext, useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { auth, uiConfig } from '../api/firebase';
import Drawer from './Drawer';
import HideOnScroll from './HideOnScroll';
import { GameContext } from '../state/GameContext';
import { UserContext } from '../state/UserContext';
import { MenuContext } from '../state/MenuContext';
import pages from './pages';

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function App() {
  const classes = useStyles();
  const { currentPage } = useContext(MenuContext);
  const { dispatch } = useContext(GameContext);
  const { user } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogShown, setDialogShown] = useState(false);
  const [offline, setISOffline] = useState(!navigator.onLine);

  const CurrentPageComponent = pages.find(({ id }) => id === currentPage).component;
  const accountDropdownShown = Boolean(anchorEl);

  const handleMenu = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const signOut = () => {
    auth.signOut();
    dispatch({ type: 'RESET' });
    handleClose();
  };
  const showDialog = () => {
    setDialogShown(true);
    handleClose();
  };
  const hideDialog = () => setDialogShown(false);
  const showDrawer = () => setDrawerOpen(true);

  useEffect(() => {
    if (user) {
      hideDialog();
    }
  }, [user]);

  useEffect(() => {
    const handleChange = () => setISOffline(!navigator.onLine);
    window.addEventListener('online', handleChange);
    window.addEventListener('offline', handleChange);
    return () => {
      window.removeEventListener('online', handleChange);
      window.removeEventListener('offline', handleChange);
    };
  }, []);

  const renderMenu = () => (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={accountDropdownShown}
      onClose={handleClose}
    >
      {user ? (
        [
          <MenuItem key="1" disabled>
            {`Belépve, mint ${user.displayName}`}
          </MenuItem>,
          <MenuItem key="2" onClick={signOut}>
            Kilépés
          </MenuItem>,
        ]
      ) : (
        <MenuItem onClick={showDialog}>Belépés</MenuItem>
      )}
    </Menu>
  );

  const renderToolbar = () => (
    <Toolbar>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="Menu"
        onClick={showDrawer}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" className={classes.title}>
        Score Counter
      </Typography>
      {offline && <Chip color="secondary" label="OFFLINE" size="small" />}
      <div>
        <IconButton
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        {renderMenu()}
      </div>
    </Toolbar>
  );

  return (
    <>
      <CssBaseline />

      <Dialog open={dialogShown} onClose={hideDialog}>
        <DialogContent>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </DialogContent>
      </Dialog>

      <Drawer open={drawerOpen} setOpen={setDrawerOpen} />

      <HideOnScroll>
        <AppBar>{renderToolbar()}</AppBar>
      </HideOnScroll>

      <Toolbar />

      <Container>
        <CurrentPageComponent />
      </Container>
    </>
  );
}
