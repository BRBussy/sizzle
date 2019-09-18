import AppContext from 'context/App';
import FirebaseContext from 'context/Firebase';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import MuiThemeContext from './context/theme';
import './index.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <FirebaseContext>
    <AppContext>
      <MuiThemeContext>
        <App/>
      </MuiThemeContext>
    </AppContext>
  </FirebaseContext>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
