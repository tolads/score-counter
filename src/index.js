import React from 'react';
import ReactDOM from 'react-dom';

import App from './view/App';
import MenuProvider from './state/MenuContext';
import GameProvider from './state/GameContext';
import UserProvider from './state/UserContext';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <UserProvider>
    <MenuProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </MenuProvider>
  </UserProvider>,
  document.getElementById('root'),
);

serviceWorker.register();
