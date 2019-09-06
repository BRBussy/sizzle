import app from 'firebase/app';
import 'firebase/auth';

class Firebase {
    auth: firebase.auth.Auth;

    constructor() {
        try {
            // load the web app's Firebase configuration from environment
            const firebaseConfigString = process.env.REACT_APP_FIREBASE_CONFIG ? process.env.REACT_APP_FIREBASE_CONFIG : "";
            const firebaseConfig = JSON.parse(firebaseConfigString);
            app.initializeApp(firebaseConfig);
        } catch (e) {
            console.error('error constructing firebase: ', e)
        }
        this.auth = app.auth();
    }

    doCreateUserWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return this.auth.createUserWithEmailAndPassword(email, password)
    }

    doSignInWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return this.auth.signInWithEmailAndPassword(email, password)
    }

    doSignOut(): Promise<void> {
        return this.auth.signOut()
    }
}

export default Firebase;