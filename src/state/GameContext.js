import React, { createContext, useContext, useEffect, useReducer, useState, useRef } from 'react';
import _ from 'lodash';

import { db } from '../api/firebase';
import { UserContext } from './UserContext';

export const GameContext = createContext();

const USERS = 'users';
const GAMES = 'games';

const initialState = {
  currentGameId: null,
  games: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_GAME':
      return { ...state, currentGameId: action.id };
    case 'START_NEW_GAME':
      return {
        ...state,
        currentGameId: action.newGame.id,
        games: [...state.games, action.newGame],
      };
    case 'UPDATE_GAMES':
      return {
        ...state,
        games: action.games,
      };
    case 'RESET':
      return initialState;
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

const getGameCollection = user =>
  db
    .collection(USERS)
    .doc(user.uid)
    .collection(GAMES);

export default function GameProvider({ children }) {
  const { user } = useContext(UserContext);
  const prevUser = useRef(user);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [lastOnline, setLastOnline] = useState(null);

  // handle signing in
  useEffect(() => {
    if (!user || user === prevUser.current || !navigator.onLine) {
      return;
    }

    state.games.map(async game => {
      const { id, ...rest } = game;
      try {
        const docRef = await getGameCollection(user).add(rest);
        dispatch({ type: 'CHANGE_ID', oldId: game.id, newId: docRef.id });
      } catch (err) {
        console.error(err);
      }
    });
    prevUser.current = user;
  }, [state.games, user]);

  // handle when state changes from online to offline
  useEffect(() => {
    const handleOffline = () => setLastOnline(new Date());
    window.addEventListener('offline', handleOffline);
    return () => window.removeEventListener('offline', handleOffline);
  }, []);

  // handle when state changes from offline to online
  useEffect(() => {
    const handleOnline = () => {
      if (!user || !navigator.onLine) {
        return;
      }

      state.games.map(async game => {
        const { id, ...rest } = game;

        // if the game has not been modified, do not upload it
        if (!lastOnline || rest.dateModified < lastOnline) {
          return;
        }

        try {
          if (typeof id === 'number') {
            const docRef = await getGameCollection(user).add(rest);
            dispatch({ type: 'CHANGE_ID', oldId: game.id, newId: docRef.id });
          } else {
            getGameCollection(user)
              .doc(id)
              .set(rest);
          }
        } catch (err) {
          console.error(err);
        }
      });
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [lastOnline, state.games, user]);

  // update state when new data arrives from API
  useEffect(() => {
    if (user && navigator.onLine) {
      try {
        return getGameCollection(user).onSnapshot(({ docs }) => {
          if (docs.length) {
            dispatch({
              type: 'UPDATE_GAMES',
              games: docs.map(doc => {
                const game = doc.data();
                return {
                  ...game,
                  ...(game.dateCreated ? { dateCreated: game.dateCreated.toDate() } : {}),
                  ...(game.dateModified ? { dateModified: game.dateModified.toDate() } : {}),
                  id: doc.id,
                };
              }),
            });
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
    return undefined;
  }, [user]);

  /**
   * Start a new game
   * @param {string[]} players
   */
  const startNewGame = async players => {
    const dateCreated = new Date();
    const newGame = {
      dateCreated,
      dateModified: dateCreated,
      players,
      rounds: [
        players.reduce((acc, curr) => ({ ...acc, [curr]: 7 }), {}),
        players.reduce((acc, curr) => ({ ...acc, [curr]: null }), {}),
      ],
    };
    if (user && navigator.onLine) {
      try {
        const docRef = await getGameCollection(user).add(newGame);
        newGame.id = docRef.id;
      } catch (err) {
        console.error(err);
      }
    }
    if (newGame.id === undefined) {
      newGame.id = Number(_.uniqueId());
    }
    dispatch({ type: 'START_NEW_GAME', newGame });
  };

  /**
   * Update a score
   * @param {Object} params
   * @param {string|number} params.id
   * @param {number} params.round
   * @param {string} params.player
   * @param {?number} params.value
   */
  const updateScore = params => {
    const games = state.games.map(game => {
      if (game.id !== params.id) {
        return game;
      }
      let rounds = game.rounds.map((round, roundId) =>
        roundId !== params.round ? round : { ...round, [params.player]: params.value },
      );
      const lastRound = rounds[rounds.length - 1];
      if (game.players.some(player => lastRound[player])) {
        rounds = [...rounds, game.players.reduce((acc, curr) => ({ ...acc, [curr]: null }), {})];
      }
      const updatedGame = { ...game, rounds, dateModified: new Date() };
      if (user && navigator.onLine) {
        try {
          getGameCollection(user)
            .doc(params.id)
            .set(updatedGame);
        } catch (err) {
          console.error(err);
        }
      }
      return updatedGame;
    });
    dispatch({ type: 'UPDATE_GAMES', games });
  };

  return (
    <GameContext.Provider value={{ state, dispatch, startNewGame, updateScore }}>
      {children}
    </GameContext.Provider>
  );
}
