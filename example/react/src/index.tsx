import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import {EngageFire} from '../../../src';

EngageFire.getInstance({
    apiKey: "AIzaSyB0BO2DsW8udknAh0sfpvqNBHvU1vt-CY8",
    authDomain: "engage-firebase.firebaseapp.com",
    databaseURL: "https://engage-firebase.firebaseio.com",
    projectId: "engage-firebase",
    storageBucket: "engage-firebase.appspot.com",
    messagingSenderId: "255779484097",
    appId: "1:255779484097:web:772938aa5d153400",
    measurementId: "G-01FNLY3HB7"
});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
