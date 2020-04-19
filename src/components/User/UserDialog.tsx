import React, {useState} from 'react';
import {
    Dialog, DialogTitle, DialogContent, Grid,
    makeStyles, Theme, TextField, Typography, CircularProgress,
    IconButton
} from '@material-ui/core';
import {User} from 'bizzle/user';
import {
    Close as CloseIcon,
    Save as SaveIcon
} from '@material-ui/icons';
import {isEqual as _isEqual} from 'lodash';
import {Role, useRoleStoreFindMany} from 'bizzle/security/role';
import {Autocomplete} from '@material-ui/lab';

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
    user?: User;
    onUpdate?: (updatedUser: User) => void;
    onCreate?: (newUser: User) => void;
}

export default function UserDialog(props: EntryDialogProps) {
    const classes = useStyles();
    const [apiLoading, setAPILoading] = useState(false);
    const [user, setUser] = useState(new User(props.user));
    const [duplicateBudgetEntry, setDuplicateBudgetEntry] = useState(new User(props.user));
    const {
        findManyResponse: findManyRolesResponse,
        loading: findManyRolesLoading
    } = useRoleStoreFindMany();

    const handleFieldChange = (field: string) => (newValue: any) => {
        setUser(new User({
            ...user,
            [field]: newValue
        } as User));
    };

    const handleUpdate = async () => {
        setAPILoading(true);
        try {
            // await UserAdmin.UpdateOne({user});
            // if (props.onBudgetEntryUpdate) {
            //     props.onBudgetEntryUpdate(new User(user));
            // }
            setDuplicateBudgetEntry(new User(user));
        } catch (e) {
            console.error('unable to update entry', e);
        }
        setAPILoading(false);
    };

    const handleCreate = async () => {
        setAPILoading(true);
        try {
            // const createOneResponse = await UserAdmin.CreateOne({user});
            // if (props.onBudgetEntryCreate) {
            //     props.onBudgetEntryCreate(new User(createOneResponse.user));
            // }
            // setUser(new User(createOneResponse.user));
            // setDuplicateBudgetEntry(new User(createOneResponse.user));
        } catch (e) {
            console.error('unable to create entry', e);
        }
        setAPILoading(false);
    };

    const entryChanged = !_isEqual(user, duplicateBudgetEntry);

    const loading = findManyRolesLoading || apiLoading;

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
                            User
                        </Typography>
                    </Grid>
                    {loading && <Grid item>
                        <CircularProgress size={25}/>
                    </Grid>}
                </Grid>
                <Grid container direction={'row-reverse'} alignItems={'center'} spacing={1}>
                    {entryChanged &&
                    <Grid item>
                        <IconButton
                            size={'small'}
                            onClick={() => {
                                if (user.id === '') {
                                    handleCreate().finally();
                                } else {
                                    handleUpdate().finally();
                                }
                            }}
                            className={classes.closeIcon}
                            disabled={apiLoading}
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
                            value={user.name}
                            label={'Name'}
                            InputLabelProps={{shrink: true}}
                            onChange={(e) => handleFieldChange('name')(e.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth
                            variant={'outlined'}
                            margin={'dense'}
                            disabled={loading}
                            value={user.email}
                            label={'Email Address'}
                            InputLabelProps={{shrink: true}}
                            onChange={(e) => handleFieldChange('email')(e.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        <Autocomplete
                            multiple
                            options={findManyRolesResponse.records}
                            getOptionLabel={(option: Role) => (option.name)}
                            onChange={(_, selectedOptions) => handleFieldChange('roleIDs')((selectedOptions as Role[]).map((r: Role) => (r.id)))}
                            value={findManyRolesResponse.records.filter((r: Role) => (user.roleIDs.includes(r.id)))}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    margin={'dense'}
                                    variant={'standard'}
                                    label={'Roles'}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}