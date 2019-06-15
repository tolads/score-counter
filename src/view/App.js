import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import MenuIcon from '@material-ui/icons/Menu';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={true} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const pages = [
  {
    id: 'home',
    label: 'Kezdőlap',
    icon: <HomeIcon />,
    component: () => <p>Lorem ipsum</p>,
  },
  {
    id: 'about',
    label: 'Infó',
    icon: <InfoIcon />,
    component: () => (
      <Box my={2}>
        <Typography variant="body1">
          Ez egy pontszám-nyilvántartó alkalmazás. Elsőroban snapszer kártyajátékhoz készült a
          Magyar Snapszer Szövetség hivatalos{' '}
          <Link href="https://snapszer.hu/hu/hivatalos-versenyszabalyzat/">versenyszabályzata</Link>{' '}
          alapján.
        </Typography>
      </Box>
    ),
  },
];

function App() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(pages[0]);
  const CurrentPageComponent = currentPage.component;

  const toggleDrawer = value => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setOpen(value);
  };

  const renderSidebar = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {pages.map(page => (
          <ListItem button onClick={() => setCurrentPage(page)}>
            <ListItemIcon>{page.icon}</ListItemIcon>
            <ListItemText primary={page.label} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <CssBaseline />
      <SwipeableDrawer open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
        {renderSidebar()}
      </SwipeableDrawer>
      <HideOnScroll>
        <AppBar>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Score Counter
            </Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Container>
        <CurrentPageComponent />
      </Container>
    </>
  );
}

export default App;
