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
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';

import { GameContext } from '../state/GameContext';

const useStyles = makeStyles(() => ({
  tableContainer: {
    overflowX: 'auto',
  },
}));

export default function Scores() {
  const classes = useStyles();
  const { state: gameState, updateScore } = useContext(GameContext);

  const currentGame = gameState.games.find(({ id }) => id === gameState.currentGameId);
  const handleChange = event => {
    const { name, value } = event.target;
    const [round, player] = name.split('_');
    updateScore({
      id: gameState.currentGameId,
      round: Number(round),
      player,
      value: value === '' ? null : Number(value),
    });
  };

  const renderRow = (round, roundId) => (
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
  );

  const renderScores = () => (
    <>
      <Typography variant="subtitle1">
        {`Kezdés: ${format(currentGame.date, 'YYYY.MM.DD HH:mm')}`}
      </Typography>
      <Paper className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              {currentGame.players.map(player => (
                <TableCell key={player}>{player}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{currentGame.rounds.map(renderRow)}</TableBody>
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
