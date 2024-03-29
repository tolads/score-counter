import React, { useContext } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { format } from 'date-fns';

import { GameContext } from '../state/GameContext';
import { MenuContext } from '../state/MenuContext';
import { newGame, scores } from '../state/pageIds';

export default function Home() {
  const { state: gameState, dispatch } = useContext(GameContext);
  const { setCurrentPage } = useContext(MenuContext);

  const startNewGame = () => setCurrentPage(newGame);

  const renderScores = () => (
    <List>
      {gameState.games
        .sort((a, b) => b.dateCreated - a.dateCreated)
        .map(game => (
          <ListItem
            key={game.id}
            button
            onClick={() => {
              dispatch({ type: 'SET_CURRENT_GAME', id: game.id });
              setCurrentPage(scores);
            }}
          >
            <ListItemText
              primary={format(game.dateCreated, 'YYYY.MM.DD HH:mm')}
              secondary={game.players.join(', ')}
            />
          </ListItem>
        ))}
    </List>
  );

  return (
    <Box my={2}>
      <Button variant="contained" color="primary" onClick={startNewGame}>
        Új Játék
      </Button>
      <Typography variant="h6">Játszmák</Typography>
      {gameState.games.length === 0 ? (
        <Typography variant="body1">Nincs elérhető mentett játszma.</Typography>
      ) : (
        renderScores()
      )}
    </Box>
  );
}
