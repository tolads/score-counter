import React, { useReducer, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import _ from 'lodash';

import GameContext from './GameContext';
import HideOnScroll from './HideOnScroll';
import MenuContext from './MenuContext';
import pages from './pages';

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
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
  const [open, setOpen] = useState(false);
  const [gameState, dispatch] = useReducer(reducer, initialState);
  const [currentPage, setCurrentPage] = useState(pages[0].id);
  const CurrentPageComponent = pages.find(({ id }) => id === currentPage).component;

  const toggleDrawer = value => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setOpen(value);
  };

  const renderSidebar = () => (
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
  );

  return (
    <>
      <CssBaseline />
      <SwipeableDrawer open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
        {renderSidebar()}
      </SwipeableDrawer>
      <HideOnScroll>
        <AppBar>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Score Counter
            </Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Container>
        <MenuContext.Provider value={{ currentPage, setCurrentPage }}>
          <GameContext.Provider value={{ gameState, dispatch }}>
            <CurrentPageComponent />
          </GameContext.Provider>
        </MenuContext.Provider>
      </Container>
    </>
  );
}
