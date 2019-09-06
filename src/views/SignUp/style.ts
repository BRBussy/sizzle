import {Theme, createStyles, makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        backgroundColor: theme.palette.background.default,
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    titleLayout: {
        marginTop: theme.spacing(3),
        display: 'flex',
        alignItems: 'center',
    },
    signInLink: {
        marginTop: theme.spacing(2),
        color: theme.palette.text.secondary
    },
    signInLinkText: {
        marginLeft: theme.spacing(1),
        color: theme.palette.primary.main,
        fontWeight: 'bold',
        '&:hover': {
            color: theme.palette.primary.main
        }
    },
    button: {
        marginTop: theme.spacing(2),
        width: '100%'
    },
    identityProviderIcon: {
        marginRight: theme.spacing(1)
    },
    usernameAndPasswordFieldsLayout: {
        marginTop: theme.spacing(2),
    },
    textField: {
        width: '100%',
        '& + & ': {
            marginTop: theme.spacing(2)
        }
    },
}));

export default useStyles