import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase/app';

// load the web app's Firebase configuration
let firebaseConfig = '';
try {
    firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG ? process.env.REACT_APP_FIREBASE_CONFIG : "")
} catch (e) {
    console.error('error parsing firebase configuration: ', e)
}

console.log("configuration:", firebaseConfig);

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
