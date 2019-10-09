import {
    Button, CircularProgress, TextField, Typography
} from '@material-ui/core';
import {useAppContext} from 'context/App';
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import useStyles from './style';

const Login: React.FC = () => {
    const {appContextLogin} = useAppContext();
    const classes = useStyles();
    const [state, setState] = useState({
        email: '',
        password: ''
    });
    const [signUpInProgress, setLoginInProgress] = useState(false);
    const [signUpErrorMessage, setLoginErrorMessage] = useState('' as string | null);

    const doLogin = async () => {
        // clear error message and start progress indicator
        setLoginErrorMessage(null);
        setLoginInProgress(true);

        try {
            await appContextLogin(state.email, state.password);
        } catch (e) {
            console.error('error performing user login', e);
            // generic error message, detailed message in console
            setLoginErrorMessage('Incorrect Credentials');
        }
        // if we are still on the login page at this point:
        // 1. an error was thrown during the login process
        // 2. credentials were incorrect or the account is not verified
        // stop the progress indicator
        if (window.location.pathname === '/login') {
            setLoginInProgress(false);
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
                            onClick={doLogin}
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

export default Login;
