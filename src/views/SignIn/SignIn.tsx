import {
  Button, CircularProgress, TextField, Typography
} from '@material-ui/core';
import { useFirebaseContext } from 'context/Firebase';
import React, { useState } from 'react';
import {
  FaGithub as GitHubIcon,
  FaGoogle as GoogleIcon,
  FaMicrosoft as MicrosoftIcon
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useStyles from './style';

const signInOptions = {
  github: 0,
  google: 1,
  microsoft: 2,
  emailPassword: 3
};

const SignIn: React.FC = () => {
  const classes = useStyles();
  const { firebase } = useFirebaseContext();
  const [state, setState] = useState({
    email: '',
    password: ''
  });
  const [signUpInProgress, setSignInInProgress] = useState(false);
  const [signUpErrorMessage, setSignInErrorMessage] = useState('' as string | null);

  const doSignIn = (method: number) => async () => {
    if (firebase == null) {
      console.error('cannot sign user in, firebase is null');
      setSignInErrorMessage('firebase is null');
      return;
    }
    // clear error message and start progress indicator
    setSignInErrorMessage(null);
    setSignInInProgress(true);

    try {
      let signedInUserCredential: firebase.auth.UserCredential;
      // try and sign the user in using chosen method
      switch (method) {
        case signInOptions.github:
          signedInUserCredential = await firebase.doSignInWithGithubViaPopUp();
          break;
        case signInOptions.google:
          signedInUserCredential = await firebase.doSignInWithGoogleViaPopUp();
          break;
        case signInOptions.microsoft:
          signedInUserCredential = await firebase.doSignInWithMicrosoftViaPopUp();
          break;
        case signInOptions.emailPassword:
          signedInUserCredential = await firebase.doSignInWithEmailAndPassword(
            state.email,
            state.password
          );
          break;
        default:
          throw new Error('invalid sign in method');
      }
      if (signedInUserCredential.user === null) {
        throw new Error('user is null');
      }
      // user signed in successfully, check if they are verified
      if (!signedInUserCredential.user.emailVerified) {
        // show a message that they should verify their email address
        setSignInErrorMessage('Please verify your email address');
        // TODO: add a button to resend verification email
      }
      // at this point the firebase 'onAuthChanged' handler in src/App.tsx
      // will have fired and if the user's email is verified they will be
      // redirected into the app, otherwise they will stay on this page
    } catch (e) {
      console.error('error performing user sign in', e);
      // generic error message, detailed message in console
      setSignInErrorMessage('Incorrect Credentials');
    }
    // if we are still on the sign in page at this point:
    // 1. an error was thrown during the sign in process
    // 2. credentials were incorrect or the account is not verified
    // stop the progress indicator
    if (window.location.pathname === '/sign-in') {
      setSignInInProgress(false);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.titleLayout}>
          <Typography variant={'h2'}>
            Sign In
          </Typography>
          {signUpInProgress && <CircularProgress/>}
        </div>
        <Button
          className={classes.button}
          href={''}
          onClick={doSignIn(signInOptions.github)}
          size={'large'}
          variant={'contained'}
        >
          <GitHubIcon className={classes.identityProviderIcon}/>
          With GitHub
        </Button>
        <Button
          className={classes.button}
          href={''}
          onClick={doSignIn(signInOptions.google)}
          size={'large'}
          variant={'contained'}
        >
          <GoogleIcon className={classes.identityProviderIcon}/>
          With Google
        </Button>
        <Button
          className={classes.button}
          href={''}
          onClick={doSignIn(signInOptions.microsoft)}
          size={'large'}
          variant={'contained'}
        >
          <MicrosoftIcon className={classes.identityProviderIcon}/>
          With Microsoft
        </Button>
        <div className={classes.usernameAndPasswordFieldsLayout}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              doSignIn(signInOptions.emailPassword)().finally();
            }}
          >
            <TextField
              className={classes.textField}
              label={'Email address'}
              name={'email'}
              type={'text'}
              variant={'outlined'}
              autoComplete='email-address'
              value={state.email}
              onChange={(e) => {
                setState({
                  ...state,
                  email: e.target.value
                });
              }}
            />
            <TextField
              className={classes.textField}
              label={'Password'}
              name={'password'}
              type={'password'}
              variant={'outlined'}
              autoComplete='current-password'
              value={state.password}
              onChange={(e) => {
                setState({
                  ...state,
                  password: e.target.value
                });
              }}
            />
            <Button
              className={classes.button}
              color={'primary'}
              href={''}
              size={'large'}
              variant={'contained'}
              onClick={doSignIn(signInOptions.emailPassword)}
            >
              Sign In now
            </Button>
          </form>
        </div>
        <Typography
          className={classes.signUpLink}
          variant={'body1'}
        >
          Don't have an account?
          <Link
            className={classes.signUpLinkText}
            to={'/sign-up'}
          >
            Sign Up
          </Link>
        </Typography>
        <Typography
          className={classes.signUpLink}
          variant={'body1'}
        >
          <Link
            className={classes.signUpLinkText}
            to={'/forgot-password'}
          >
            Forgot Password?
          </Link>
        </Typography>
        {signUpErrorMessage && <Typography color={'error'}>
          {signUpErrorMessage}
        </Typography>}
      </div>
    </div>
  );
};

export default SignIn;
