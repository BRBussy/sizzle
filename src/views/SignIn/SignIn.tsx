import React, {useContext} from 'react'
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

const SignIn = () => {
    const classes = useStyles()
    const firebaseContext = useContext(FirebaseContext)
    console.log('firebase context!', firebaseContext)

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <Typography
                    className={classes.title}
                    variant={"h2"}
                >
                    Sign in
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
                        />
                        <TextField
                            className={classes.textField}
                            label={"Password"}
                            name={"password"}
                            type={"password"}
                            variant={"outlined"}
                            autoComplete='current-password'
                        />
                        <Button
                            className={classes.button}
                            color={"primary"}
                            href={''}
                            size={"large"}
                            variant={"contained"}
                        >
                            Sign in now
                        </Button>
                    </form>
                </div>
                <Typography
                    className={classes.signUpLink}
                    variant={"body1"}
                >
                    Don&#39;t have an account?
                    <Link
                        className={classes.signUpLinkText}
                        to={"/sign-up"}
                    >
                        Sign up
                    </Link>
                </Typography>
            </div>
        </div>
    )
}

export default SignIn