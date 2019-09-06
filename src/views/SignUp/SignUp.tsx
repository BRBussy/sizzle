import React, {useState, useContext} from 'react'
import useStyles from './style'
import {Link} from 'react-router-dom'
import {
    Typography, Button, TextField,
} from "@material-ui/core"
import {
    FaGoogle as GoogleIcon,
    FaGithub as GitHubIcon,
    FaMicrosoft as MicrosoftIcon,
} from 'react-icons/fa'
import {FirebaseContext} from 'components/Firebase';
import User from 'api/User'

function useProviderSignIn() {
    const [signInInProgress, setSignInInProgress] = useState(false)

}

const SignUp = () => {
    const classes = useStyles()
    const firebaseContext = useContext(FirebaseContext)
    const [state, setState] = useState({
        user: new User(),
    });

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <Typography
                    className={classes.title}
                    variant={"h2"}
                >
                    Sign Up
                </Typography>
                <Button
                    className={classes.button}
                    href={''}
                    // onClick={() => handleProviderSignIn(gitHubProvider)}
                    size={"large"}
                    variant={"contained"}
                >
                    <GitHubIcon className={classes.identityProviderIcon}/>
                    With GitHub
                </Button>
                <Button
                    className={classes.button}
                    href={''}
                    // onClick={() => handleProviderSignIn(gitHubProvider)}
                    size={"large"}
                    variant={"contained"}
                >
                    <GoogleIcon className={classes.identityProviderIcon}/>
                    With Google
                </Button>
                <Button
                    className={classes.button}
                    href={''}
                    // onClick={() => handleProviderSignIn(gitHubProvider)}
                    size={"large"}
                    variant={"contained"}
                >
                    <MicrosoftIcon className={classes.identityProviderIcon}/>
                    With Microsoft
                </Button>
                <div className={classes.usernameAndPasswordFieldsLayout}>
                    <form>
                        <TextField
                            className={classes.textField}
                            label={"Email address"}
                            name={"email"}
                            type={"text"}
                            variant={"outlined"}
                            autoComplete='email-address'
                            value={state.user.email}
                            onChange={e => {
                                state.user.email = e.target.value
                                setState({
                                    ...state,
                                    user: state.user,
                                })
                            }}
                        />
                        <TextField
                            className={classes.textField}
                            label={"Password"}
                            name={"password"}
                            type={"password"}
                            variant={"outlined"}
                            autoComplete='current-password'
                            value={state.user.password}
                            onChange={e => {
                                state.user.password = e.target.value
                                setState({
                                    ...state,
                                    user: state.user,
                                })
                            }}
                        />
                        <Button
                            className={classes.button}
                            color={"primary"}
                            href={''}
                            size={"large"}
                            variant={"contained"}
                        >
                            Sign Up now
                        </Button>
                    </form>
                </div>
                <Typography
                    className={classes.signInLink}
                    variant={"body1"}
                >
                    Already have an account?
                    <Link
                        className={classes.signInLinkText}
                        to={"/sign-in"}
                    >
                        Sign In
                    </Link>
                </Typography>
            </div>
        </div>
    )
}

export default SignUp