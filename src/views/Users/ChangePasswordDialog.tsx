import React, {useState} from 'react';
import {
    Dialog, DialogTitle, DialogContent, Grid,
    makeStyles, Theme, TextField, Typography, CircularProgress,
    IconButton
} from '@material-ui/core';
import {User, UserAdmin} from 'bizzle/user';
import {
    Close as CloseIcon,
    Save as SaveIcon
} from '@material-ui/icons';
import {IDIdentifier} from 'bizzle/search/identifier';

const useStyles = makeStyles((theme: Theme) => ({
    dialogTitleOverride: {
        display: 'grid',
        minWidth: 280,
        gridTemplateColumns: 'auto 1fr',
        gridTemplateRows: 'auto',
        alignItems: 'center'
    },
    dialogTitleControls: {
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeIcon: {
        'color': theme.palette.action.disabled,
        '&:hover': {
            color: theme.palette.action.active
        }
    }
}));

interface EntryDialogProps {
    closeDialog: () => void;
    user: User;
}

export default function ChangePasswordDialog(props: EntryDialogProps) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');

    const handleChangePassword = async () => {
        setLoading(true);
        try {
            await UserAdmin.ChangePassword({
                userIdentifier: IDIdentifier(props.user.id),
                password
            });
        } catch (e) {
            console.error(`error registering user: ${e.message ? e.message : e.toString()}`);
        }
        setLoading(false);
    }

    return (
        <Dialog
            open={true}
            onClose={props.closeDialog}
        >
            <DialogTitle
                classes={{root: classes.dialogTitleOverride}}
                disableTypography
            >
                <Grid container direction={'row'} alignItems={'center'} spacing={1}>
                    <Grid item>
                        <Typography>
                            Register User
                        </Typography>
                    </Grid>
                    {loading && <Grid item>
                        <CircularProgress size={25}/>
                    </Grid>}
                </Grid>
                <Grid container direction={'row-reverse'} alignItems={'center'} spacing={1}>
                    {password !== '' &&
                    <Grid item>
                        <IconButton
                            size={'small'}
                            onClick={handleChangePassword}
                            className={classes.closeIcon}
                            disabled={loading}
                        >
                            <SaveIcon/>
                        </IconButton>
                    </Grid>}
                    <Grid item>
                        <IconButton
                            size={'small'}
                            onClick={props.closeDialog}
                            className={classes.closeIcon}
                            disabled={loading}
                        >
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <Grid container direction={'column'} spacing={1}>
                    <Grid item>
                        <TextField
                            fullWidth
                            variant={'outlined'}
                            margin={'dense'}
                            disabled={loading}
                            value={password}
                            label={'Password'}
                            InputLabelProps={{shrink: true}}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}