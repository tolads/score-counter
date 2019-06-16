import React, { useEffect, useReducer, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
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
import _ from 'lodash';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { auth, uiConfig } from '../api/firebase';
import Drawer from './Drawer';
import GameContext from './GameContext';
import HideOnScroll from './HideOnScroll';
import MenuContext from './MenuContext';
import pages from './pages';

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const initialState = {
  currentGameId: null,
  games: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_GAME':
      return { ...state, currentGameId: action.id };
    case 'START_NEW_GAME': {
      const id = _.uniqueId();
      return {
        ...state,
        currentGameId: id,
        games: [
          ...state.games,
          {
            id,
            date: new Date(),
            players: action.players,
            rounds: [
              action.players.reduce((acc, curr) => ({ ...acc, [curr]: 7 }), {}),
              action.players.reduce((acc, curr) => ({ ...acc, [curr]: null }), {}),
            ],
          },
        ],
      };
    }
    case 'UPDATE_SCORE': {
      return {
        ...state,
        games: state.games.map(game => {
          if (game.id !== action.id) {
            return game;
          }
          let rounds = game.rounds.map((round, roundId) =>
            roundId !== action.round ? round : { ...round, [action.player]: action.value },
          );
          const lastRound = rounds[rounds.length - 1];
          if (game.players.some(player => typeof lastRound[player] === 'number')) {
            rounds = [
              ...rounds,
              game.players.reduce((acc, curr) => ({ ...acc, [curr]: null }), {}),
            ];
          }
          return { ...game, rounds };
        }),
      };
    }
    default:
      throw new Error();
  }
};

export default function App() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(pages[0].id);
  const [user, setUser] = useState(null);
  const [dialogShown, setDialogShown] = useState(false);
  const [gameState, dispatch] = useReducer(reducer, initialState);

  const CurrentPageComponent = pages.find(({ id }) => id === currentPage).component;
  const accountDropdownShown = Boolean(anchorEl);

  const handleMenu = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const signOut = () => {
    auth().signOut();
    handleClose();
  };
  const showDialog = () => {
    setDialogShown(true);
    handleClose();
  };
  const hideDialog = () => setDialogShown(false);
  const showDrawer = () => setDrawerOpen(true);

  useEffect(() => {
    return auth().onAuthStateChanged(user => {
      setUser(user);
      hideDialog();
    });
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
            Belépve, mint {user.displayName}
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
    <MenuContext.Provider value={{ currentPage, setCurrentPage }}>
      <CssBaseline />

      <Dialog open={dialogShown} onClose={hideDialog}>
        <DialogContent>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth()} />
        </DialogContent>
      </Dialog>

      <Drawer open={drawerOpen} setOpen={setDrawerOpen} />

      <HideOnScroll>
        <AppBar>{renderToolbar()}</AppBar>
      </HideOnScroll>

      <Toolbar />

      <Container>
        <GameContext.Provider value={{ gameState, dispatch }}>
          <CurrentPageComponent />
        </GameContext.Provider>
      </Container>
    </MenuContext.Provider>
  );
}
