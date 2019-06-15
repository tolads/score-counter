import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

export default function Home() {
  return (
    <Box my={2}>
      <Button variant="contained" color="primary">
        Új Játék
      </Button>
    </Box>
  );
}
