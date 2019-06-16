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

import { auth, db, uiConfig } from '../api/firebase';
import Drawer from './Drawer';
import GameContext from './GameContext';
import HideOnScroll from './HideOnScroll';
import MenuContext from './MenuContext';
import pages from './pages';

const USERS = 'users';
const GAMES = 'games';

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
      return {
        ...state,
        currentGameId: action.newGame.id,
        games: [...state.games, action.newGame],
      };
    }
    case 'UPDATE_SCORE': {
      return {
        ...state,
        games: action.games,
      };
    }
    case 'UPDATE_GAMES': {
      return {
        ...state,
        games: action.games,
      };
    }
    case 'RESET': {
      return initialState;
    }
    case 'CHANGE_ID':
      return {
        ...state,
        currentGameId: state.currentGameId === action.oldId ? action.newId : state.currentGameId,
        games: state.games.map(game => {
          if (game.id !== action.oldId) {
            return game;
          }
          return { ...game, id: action.newId };
        }),
      };
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
    return auth.onAuthStateChanged(userProp => {
      if (userProp && user !== userProp) {
        gameState.games.map(async game => {
          const { id, ...rest } = game;
          const docRef = await db
            .collection(USERS)
            .doc(userProp.uid)
            .collection(GAMES)
            .add(rest);
          dispatch({ type: 'CHANGE_ID', oldId: game.id, newId: docRef.id });
        });
      }

      setUser(userProp);
      hideDialog();
    });
  }, [gameState.games, user]);

  useEffect(() => {
    if (user && user.uid) {
      return db
        .collection(USERS)
        .doc(user.uid)
        .collection(GAMES)
        .onSnapshot(({ docs, metadata }) => {
          if (docs.length) {
            dispatch({
              type: 'UPDATE_GAMES',
              games: docs.map(doc => {
                const game = doc.data();
                return { ...game, date: game.date.toDate(), id: doc.id };
              }),
            });
          }
        });
    }
  }, [user]);

  const startNewGame = async players => {
    const newGame = {
      date: new Date(),
      players,
      rounds: [
        players.reduce((acc, curr) => ({ ...acc, [curr]: 7 }), {}),
        players.reduce((acc, curr) => ({ ...acc, [curr]: null }), {}),
      ],
    };
    if (user && user.uid) {
      try {
        const docRef = await db
          .collection(USERS)
          .doc(user.uid)
          .collection(GAMES)
          .add(newGame);
        newGame.id = docRef.id;
      } catch (x) {}
    }
    if (newGame.id === undefined) {
      newGame.id = _.uniqueId();
    }
    dispatch({ type: 'START_NEW_GAME', newGame });
  };

  const updateScore = action => {
    const games = gameState.games.map(game => {
      if (game.id !== action.id) {
        return game;
      }
      let rounds = game.rounds.map((round, roundId) =>
        roundId !== action.round ? round : { ...round, [action.player]: action.value },
      );
      const lastRound = rounds[rounds.length - 1];
      if (game.players.some(player => typeof lastRound[player] === 'number')) {
        rounds = [...rounds, game.players.reduce((acc, curr) => ({ ...acc, [curr]: null }), {})];
      }
      if (user && user.uid) {
        db.collection(USERS)
          .doc(user.uid)
          .collection(GAMES)
          .doc(action.id)
          .set({ ...game, rounds });
      }
      return { ...game, rounds };
    });
    dispatch({ type: 'UPDATE_SCORE', games });
  };

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
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </DialogContent>
      </Dialog>

      <Drawer open={drawerOpen} setOpen={setDrawerOpen} />

      <HideOnScroll>
        <AppBar>{renderToolbar()}</AppBar>
      </HideOnScroll>

      <Toolbar />

      <Container>
        <GameContext.Provider value={{ gameState, dispatch, startNewGame, updateScore }}>
          <CurrentPageComponent />
        </GameContext.Provider>
      </Container>
    </MenuContext.Provider>
  );
}
