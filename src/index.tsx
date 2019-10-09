import AppContext from 'context/App';
import React from 'react';
import ReactDOM from 'react-dom';
import config from 'react-global-configuration';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

let subdomain = 'localhost';
try {
    subdomain = window.location.hostname.split('.')[0];
} catch (e) {
    console.error('error determining subdomain', e);
}

if (subdomain === 'localHost') {
    config.set({
        authURL: 'http://localhost:8080',
        userURL: 'http://localhost:8081',
        roleURL: 'http://localhost:8082'
    });
} else {
    config.set({
        authURL: '',
        userURL: '',
        roleURL: ''
    });
}

ReactDOM.render(
    <AppContext>
        <App/>
    </AppContext>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
