import React, {useState, useContext} from 'react'
import useStyles from './style'
import {History} from 'history';
import {Link} from 'react-router-dom'
import {
    Typography, Button, TextField, CircularProgress,
} from "@material-ui/core"
import {
    FaGoogle as GoogleIcon,
    FaGithub as GitHubIcon,
    FaMicrosoft as MicrosoftIcon,
} from 'react-icons/fa'
import {FirebaseContext} from 'components/Firebase';
import User from 'api/User'

interface SignUpProps {
    history: History,
}

const SignUp = (props: SignUpProps) => {
    const classes = useStyles()
    const firebase = useContext(FirebaseContext)
    const [state, setState] = useState({
        user: new User(),
    });
    const [signUpInProgress, setSignUpInProgress] = useState(false)
    const [signUpErrorMessage, setSignUpErrorMessage] = useState('' as string | null)
    const [signUpSuccessMessage, setSignUpSuccessMessage] = useState('' as string | null)

    const doFirebaseSignUpUserWithEmailAndPassword = async () => {
        if (firebase == null) {
            console.error('cannot sign user up, firebase is null')
            setSignUpErrorMessage('firebase is null')
            return
        }
        // clear error message and start progress indicator
        setSignUpErrorMessage(null)
        setSignUpInProgress(true)
        try {
            // try and sign the user up
            await firebase.doCreateUserWithEmailAndPassword(
                state.user.email,
                state.user.password,
            )
            // user signed up successfully, stop progress indicator
            setSignUpInProgress(false)

            // display success message
            setSignUpSuccessMessage('Signed Up Successfully!')

            // wait for a second
            await new Promise(resolve => setTimeout(resolve, 1000))

            // navigate to sign in
            props.history.push('/sign-in')

        } catch (e) {
            console.error('error performing user sign up', e)
            setSignUpErrorMessage(e.message ? e.message : e.toString())
            setSignUpInProgress(false)
            return
        }
    }

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <div className={classes.titleLayout}>
                    <Typography variant={"h2"}>
                        Sign Up
                    </Typography>
                    {signUpInProgress && <CircularProgress/>}
                </div>
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
                            onClick={doFirebaseSignUpUserWithEmailAndPassword}
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
                {signUpErrorMessage && <Typography color={'error'}>
                    {signUpErrorMessage}
                </Typography>}
                {signUpSuccessMessage && <Typography>
                    {signUpSuccessMessage}
                </Typography>}
            </div>
        </div>
    )
}

export default SignUp