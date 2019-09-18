import firebaseApp from 'firebase/app';
import 'firebase/auth';

const googleAuthProvider = new firebaseApp.auth.GoogleAuthProvider();
const githubAuthProvider = new firebaseApp.auth.GithubAuthProvider();
const microsoftAuthProvider = new firebaseApp.auth.OAuthProvider('microsoft.com');

class Firebase {
  public auth: firebase.auth.Auth;

  constructor() {
    try {
      // load the web firebaseApp's Firebase configuration from environment
      const firebaseConfigString = process.env.REACT_APP_FIREBASE_CONFIG ? process.env.REACT_APP_FIREBASE_CONFIG : '';
      const firebaseConfig = JSON.parse(firebaseConfigString);

      // if a firebase firebaseApp does not yet exist
      if (firebaseApp.apps.length === 0) {
        // initialise the firebaseApp
        firebaseApp.initializeApp(firebaseConfig);
      }
    } catch (e) {
      console.error('error constructing firebase: ', e);
    }
    this.auth = firebaseApp.auth();
  }

  //
  // Email address and password
  //
  public doSignUpWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  public doSignInWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  //
  // Google
  //
  public doSignInWithGoogleViaPopUp(): Promise<firebase.auth.UserCredential> {
    return this.auth.signInWithPopup(googleAuthProvider);
  }

  //
  // Github
  //
  public doSignInWithGithubViaPopUp(): Promise<firebase.auth.UserCredential> {
    return this.auth.signInWithPopup(githubAuthProvider);
  }

  //
  // Microsoft
  //
  public doSignInWithMicrosoftViaPopUp(): Promise<firebase.auth.UserCredential> {
    return this.auth.signInWithPopup(microsoftAuthProvider);
  }

  public doSignOut(): Promise<void> {
    return this.auth.signOut();
  }
}

export default Firebase;
