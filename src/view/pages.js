import React from 'react';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';

import About from './About';
import Home from './Home';
import NewGame from './NewGame';
import Scores from './Scores';
import { newGame, scores } from './pageIds';

export default [
  {
    id: 'home',
    label: 'Kezdőlap',
    icon: <HomeIcon />,
    component: Home,
  },
  {
    id: newGame,
    label: 'Új Játék',
    icon: <FiberNewIcon />,
    component: NewGame,
  },
  {
    id: scores,
    component: Scores,
    hideFromMenu: true,
  },
  {
    id: 'about',
    label: 'Infó',
    icon: <InfoIcon />,
    component: About,
  },
];
