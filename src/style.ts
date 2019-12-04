import {createStyles, makeStyles, Theme} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({
    loadingRoot: {
        backgroundColor: theme.palette.background.default,
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
}));

export default useStyles;
