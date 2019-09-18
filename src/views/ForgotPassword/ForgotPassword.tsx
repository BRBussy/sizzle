import {
  Button, CircularProgress, TextField, Typography
} from '@material-ui/core';
import { useFirebaseContext } from 'context/Firebase';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useStyles from './style';

const ForgotPassword: React.FC = () => {
  const classes = useStyles();
  const { firebase } = useFirebaseContext();
  const [state, setState] = useState({
    email: ''
  });
  const [forgotPasswordInProgress, setForgotPasswordInProgress] = useState(false);
  const [successMessage, setSuccessMessage] = useState('' as string | null);

  const doSendResetEmail = async () => {
    setForgotPasswordInProgress(true);
    try {
      if (firebase == null) {
        throw new Error('firebase is null');
      }
      await firebase.auth.sendPasswordResetEmail(state.email);
      setSuccessMessage('Check your email for a reset link');
      setState({
        ...state,
        email: ''
      });
    } catch (e) {
      console.error('error sending reset email', e);
    }
    setForgotPasswordInProgress(false);
  };

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.titleLayout}>
          <Typography variant={'h2'}>
            Forgot Password
          </Typography>
          {forgotPasswordInProgress && <CircularProgress/>}
        </div>
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
              onChange={(e) => {
                setState({
                  ...state,
                  email: e.target.value
                });
              }}
            />
            <Button
              className={classes.button}
              color={'primary'}
              href={''}
              size={'large'}
              variant={'contained'}
              onClick={doSendResetEmail}
            >
              Send Reset Email
            </Button>
          </form>
        </div>
        <Typography
          className={classes.signUpLink}
          variant={'body1'}
        >
          Back To Sign In?
          <Link
            className={classes.signUpLinkText}
            to={'/sign-in'}
          >
            Sign In
          </Link>
        </Typography>
        {successMessage && <Typography>
          {successMessage}
        </Typography>}
      </div>
    </div>
  );
};

export default ForgotPassword;
