import React, {useState, useContext, useEffect} from 'react'
import useStyles from './style'
import {Link} from 'react-router-dom'
import {
    Typography, Button, TextField, CircularProgress,
} from "@material-ui/core"
import {
    FaGoogle as GoogleIcon,
    FaGithub as GitHubIcon,
    FaMicrosoft as MicrosoftIcon,
} from 'react-icons/fa'
import Firebase, {FirebaseContext} from 'components/Firebase';
import User from 'api/User'

const SignUp = () => {
    const classes = useStyles()
    const firebase = useContext(FirebaseContext)
    const [state, setState] = useState({
        user: new User(),
    });
    const [signUpInProgress, setSignUpInProgress] = useState(false)
    const [signUpError, setSignUpError] = useState('' as string | null)
    const [userCredential, setUserCredential] = useState({} as firebase.auth.UserCredential)

    const doFirebaseSignUpUserWithEmailAndPassword = async () => {
        if (firebase == null) {
            console.error('cannot sign user up, firebase is null')
            setSignUpError('firebase is null')
            return
        }
        setSignUpError(null)
        setSignUpInProgress(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 2000))
            const userCredential = await firebase.doCreateUserWithEmailAndPassword(
                state.user.email,
                state.user.password,
            )
            setUserCredential(userCredential)
        } catch (e) {
            console.error('error performing user sign up', e)
            setSignUpError(e.message ? e.message : e.toString())
        }
        setSignUpInProgress(false)
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
                {signUpError && <Typography color={'error'}>
                    {signUpError}
                </Typography>}
            </div>
        </div>
    )
}

export default SignUp