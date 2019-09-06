import app from 'firebase/app';

class Firebase {
    constructor() {
        try {
            // load the web app's Firebase configuration
            const firebaseConfigString = process.env.REACT_APP_FIREBASE_CONFIG ? process.env.REACT_APP_FIREBASE_CONFIG : "";
            const firebaseConfig = JSON.parse(firebaseConfigString);
            app.initializeApp(firebaseConfig);
        } catch (e) {
            console.error('error constructing firebase: ', e)
        }
    }
}

export default Firebase;