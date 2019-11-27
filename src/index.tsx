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

if (subdomain === 'localhost') {
    config.set({
        authURL: 'http://localhost:8080/api',
        userURL: 'http://localhost:8081/api',
        roleURL: 'http://localhost:8082/api',
        exerciseURL: 'http://localhost:8083/api'
    });
} else {
    config.set({
        authURL: 'https://auth-ylnmede6pq-uc.a.run.app/api',
        userURL: 'https://user-ylnmede6pq-uc.a.run.app/api',
        roleURL: 'https://role-ylnmede6pq-uc.a.run.app/api',
        exerciseURL: 'http://localhost:8083/api'
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
