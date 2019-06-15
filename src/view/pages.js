import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';

import About from './About';
import Home from './Home';

export default [
  {
    id: 'home',
    label: 'Kezdőlap',
    icon: <HomeIcon />,
    component: Home,
  },
  {
    id: 'about',
    label: 'Infó',
    icon: <InfoIcon />,
    component: About,
  },
];
