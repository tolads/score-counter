import React, { useContext } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import MenuContext from './MenuContext';
import { newGame } from './pageIds';

export default function Home() {
  const { setCurrentPage } = useContext(MenuContext);
  const startNewGame = () => setCurrentPage(newGame);

  return (
    <Box my={2}>
      <Button variant="contained" color="primary" onClick={startNewGame}>
        Új Játék
      </Button>
    </Box>
  );
}
