import React from 'react';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

export default function About() {
  return (
    <Box my={2}>
      <Typography variant="body1">
        Ez egy pontszám-nyilvántartó alkalmazás. Elsőroban snapszer kártyajátékhoz készült a Magyar
        Snapszer Szövetség hivatalos{' '}
        <Link href="https://snapszer.hu/hu/hivatalos-versenyszabalyzat/">versenyszabályzata</Link>{' '}
        alapján.
      </Typography>
    </Box>
  );
}
