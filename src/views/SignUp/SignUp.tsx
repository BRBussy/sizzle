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

const signUpOptions = {
  github: 0,
  google: 1,
  microsoft: 2,
  emailPassword: 3
};

const SignUp: React.FC = () => {
  const classes = useStyles();
  const { firebase } = useFirebaseContext();
  const [state, setState] = useState({
    email: '',
    password: ''
  });
  const [signUpInProgress, setSignUpInProgress] = useState(false);
  const [signUpErrorMessage, setSignUpErrorMessage] = useState('' as string | null);
  const [signUpSuccessMessage, setSignUpSuccessMessage] = useState('' as string | null);

  const doSignUp = (method: number) => async () => {
    if (firebase == null) {
      console.error('cannot sign user up, firebase is null');
      setSignUpErrorMessage('firebase is null');
      return;
    }
    // clear error message and start progress indicator
    setSignUpErrorMessage(null);
    setSignUpInProgress(true);

    try {
      let signedUpUserCredential: firebase.auth.UserCredential;
      // try and sign the user up using chosen method
      switch (method) {
        case signUpOptions.github:
          signedUpUserCredential = await firebase.doSignInWithGithubViaPopUp();
          break;
        case signUpOptions.google:
          signedUpUserCredential = await firebase.doSignInWithGoogleViaPopUp();
          break;
        case signUpOptions.microsoft:
          signedUpUserCredential = await firebase.doSignInWithMicrosoftViaPopUp();
          break;
        case signUpOptions.emailPassword:
          signedUpUserCredential = await firebase.doSignUpWithEmailAndPassword(
            state.email,
            state.password
          );
          break;
        default:
          throw new Error('invalid sign up method');
      }
      if (signedUpUserCredential.user === null) {
        throw new Error('user is null');
      }
      // user signed up successfully, send verification email if necessary
      if (!signedUpUserCredential.user.emailVerified) {
        await signedUpUserCredential.user.sendEmailVerification();
        setSignUpSuccessMessage('Signed up! Check your email for a validation Link.');
        // TODO: add button to resend verification email
      }
      // at this point the firebase 'onAuthChanged' handler in src/App.tsx
      // will have fired and if the user's email is already verified (as is the case with google sign up)
      // they will be redirected into the app, otherwise they will stay on this page
    } catch (e) {
      console.error('error performing user sign up', e);
      setSignUpErrorMessage(e.message ? e.message : e.toString());
    }
    // if we are still on the sign up page at this point:
    // 1. an error was thrown during the sign up process
    // 2. the user needs to verify there email address
    // stop the progress indicator and clear email and password fields
    if (window.location.pathname === '/sign-up') {
      setSignUpInProgress(false);
      setState({
        email: '',
        password: ''
      });
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.titleLayout}>
          <Typography variant={'h2'}>
            Sign Up
          </Typography>
          {signUpInProgress && <CircularProgress/>}
        </div>
        <Button
          className={classes.button}
          href={''}
          onClick={doSignUp(signUpOptions.github)}
          size={'large'}
          variant={'contained'}
        >
          <GitHubIcon className={classes.identityProviderIcon}/>
          With GitHub
        </Button>
        <Button
          className={classes.button}
          href={''}
          onClick={doSignUp(signUpOptions.google)}
          size={'large'}
          variant={'contained'}
        >
          <GoogleIcon className={classes.identityProviderIcon}/>
          With Google
        </Button>
        <Button
          className={classes.button}
          href={''}
          onClick={doSignUp(signUpOptions.microsoft)}
          size={'large'}
          variant={'contained'}
        >
          <MicrosoftIcon className={classes.identityProviderIcon}/>
          With Microsoft
        </Button>
        <div className={classes.usernameAndPasswordFieldsLayout}>
          <form>
            <TextField
              className={classes.textField}
              label={'Email address'}
              name={'email'}
              type={'text'}
              variant={'outlined'}
              autoComplete='email-address'
              value={state.email}
              onChange={(e) => setState({
                ...state,
                email: e.target.value
              })}
            />
            <TextField
              className={classes.textField}
              label={'Password'}
              name={'password'}
              type={'password'}
              variant={'outlined'}
              autoComplete='current-password'
              value={state.password}
              onChange={(e) => setState({
                ...state,
                password: e.target.value
              })}
            />
            <Button
              className={classes.button}
              color={'primary'}
              href={''}
              size={'large'}
              variant={'contained'}
              onClick={doSignUp(signUpOptions.emailPassword)}
            >
              Sign Up now
            </Button>
          </form>
        </div>
        <Typography
          className={classes.signInLink}
          variant={'body1'}
        >
          Already have an account?
          <Link
            className={classes.signInLinkText}
            to={'/sign-in'}
          >
            Sign In
          </Link>
        </Typography>
        {signUpErrorMessage && <Typography color={'error'}>
          {signUpErrorMessage}
        </Typography>}
        {signUpSuccessMessage && <Typography>
          {signUpSuccessMessage}
        </Typography>}
      </div>
    </div>
  );
};

export default SignUp;
