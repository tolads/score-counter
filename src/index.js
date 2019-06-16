import React from 'react';
import ReactDOM from 'react-dom';

import App from './view/App';
import MenuProvider from './view/MenuContext';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <MenuProvider>
    <App />
  </MenuProvider>,
  document.getElementById('root'),
);

serviceWorker.register();
