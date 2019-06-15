import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

export default function NewGame() {
  const [players, setPlayers] = useState(['', '']);
  const addPlayer = () => setPlayers(players => [...players, '']);
  const handleChange = event => {
    const { name, value } = event.target;
    const editedId = Number(name);
    setPlayers(players => players.map((player, id) => (editedId === id ? value : player)));
  };
  const start = () => {};
  const canStart = players.length >= 2 && players.length <= 4;
  const canAddPlayer = players.length < 4;

  return (
    <Box my={2}>
      <Typography variant="h4">Új játék kezdése</Typography>
      <Typography variant="h6">Játékosok:</Typography>
      <List>
        {players.map((player, id) => (
          <ListItem key={id}>
            <Input name={String(id)} onChange={handleChange} value={player} />
          </ListItem>
        ))}
      </List>
      {canAddPlayer && (
        <Button variant="contained" color="default" onClick={addPlayer}>
          <AddIcon />
          Új játékos hozzáadása
        </Button>
      )}
      {canStart && (
        <Button variant="contained" color="primary" onClick={start}>
          Játék indítása
        </Button>
      )}
    </Box>
  );
}
