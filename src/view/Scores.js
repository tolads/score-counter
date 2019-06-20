import React, { useContext, useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { format } from 'date-fns';

import { GameContext } from '../state/GameContext';

const multiplayerValues = [
  '(nincs)',
  'Kontra (x2)',
  'Rekontra (x4)',
  'Szubkontra (x8)',
  'More kontra (x16)',
];

const useStyles = makeStyles(theme => ({
  tableContainer: {
    overflowX: 'auto',
    marginBottom: 70,
  },
  multiplayer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#eee',
  },
  multiplayerLabel: {
    marginRight: 10,
    marginLeft: 10,
  },
  multiplayerIncrement: {
    width: 175,
    flexGrow: 1,
    fontSize: 13,
    [theme.breakpoints.up('sm')]: {
      flexGrow: 0,
      fontSize: 14,
    },
  },
  multiplayerRemove: {
    marginRight: 10,
    marginLeft: 10,
  },
}));

export default function Scores() {
  const classes = useStyles();
  const { state: gameState, updateScore } = useContext(GameContext);
  const [multiplayerValueInd, setMultiplayerValueInd] = useState(0);

  const resetMultiplayerValue = () => setMultiplayerValueInd(0);
  const incrementMultiplayerValue = () =>
    setMultiplayerValueInd(state => (state + 1) % multiplayerValues.length);
  const multiplayerValue = multiplayerValues[multiplayerValueInd];

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

  const renderMultiplier = () => (
    <div className={classes.multiplayer}>
      <Typography className={classes.multiplayerLabel} variant="body1">
        Bemondás:
      </Typography>
      <Button
        className={classes.multiplayerIncrement}
        variant="contained"
        color="primary"
        onClick={incrementMultiplayerValue}
      >
        {multiplayerValue}
      </Button>
      <Fab className={classes.multiplayerRemove} size="small" onClick={resetMultiplayerValue}>
        <CloseIcon />
      </Fab>
    </div>
  );

  const renderScores = () => (
    <>
      <Typography variant="subtitle1">
        {`Kezdés: ${format(currentGame.dateCreated, 'YYYY.MM.DD HH:mm')}`}
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
      {renderMultiplier()}
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
