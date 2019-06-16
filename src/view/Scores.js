import React, { useContext } from 'react';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { format } from 'date-fns';

import GameContext from './GameContext';

export default function Scores() {
  const { gameState, updateScore } = useContext(GameContext);
  const currentGame = gameState.games.find(({ id }) => id === gameState.currentGameId);
  const handleChange = event => {
    const { name, value } = event.target;
    const [round, player] = name.split('_');
    updateScore({
      type: 'UPDATE_SCORE',
      id: gameState.currentGameId,
      round: Number(round),
      player,
      value: value === '' ? null : Number(value),
    });
  };

  const renderScores = () => (
    <>
      <Typography variant="subtitle1">
        Kezdés: {format(currentGame.date, 'YYYY.MM.DD HH:mm')}
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              {currentGame.players.map(player => (
                <TableCell key={player}>{player}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentGame.rounds.map((round, roundId) => (
              <TableRow key={roundId}>
                <TableCell variant="head">{`#${roundId}`}</TableCell>
                {currentGame.players.map(player => (
                  <TableCell key={player}>
                    <Input
                      type="number"
                      name={`${roundId}_${player}`}
                      onChange={handleChange}
                      value={round[player] === null ? '' : round[player]}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );

  return (
    <Box my={2}>
      <Typography variant="h4">Játszma</Typography>
      {!currentGame ? (
        <Typography variant="body1">A játszma nem található.</Typography>
      ) : (
        renderScores()
      )}
    </Box>
  );
}
