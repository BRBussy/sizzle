import React, {useEffect, useState} from 'react';
import {
    Dialog, DialogTitle, DialogContent, Grid,
    makeStyles, Theme, TextField, Typography, CircularProgress,
    IconButton, MenuItem
} from '@material-ui/core';
import {BudgetEntryCategoryRule, BudgetEntryCategoryRuleStore} from 'bizzle/budget/entry/categoryRule';
import {BudgetEntry, BudgetEntryAdmin} from 'bizzle/budget/entry';
import {
    Close as CloseIcon,
    Save as SaveIcon
} from '@material-ui/icons';
import {isEqual as _isEqual} from 'lodash';
import moment from 'moment';
import {useAppContext} from 'context/App';

interface EntryDialogProps {
    closeDialog: () => void;
    budgetEntryCategoryRules?: BudgetEntryCategoryRule[];
    budgetEntry: BudgetEntry;
    onBudgetEntryUpdate?: (updatedBudgetEntry: BudgetEntry) => void;
    onBudgetEntryCreate?: (newBudgetEntry: BudgetEntry) => void;
}

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

export default function EntryDialog(props: EntryDialogProps) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [budgetEntryCategoryRules, setBudgetEntryCategoryRules] = useState<BudgetEntryCategoryRule[]>(
        props.budgetEntryCategoryRules
            ? props.budgetEntryCategoryRules
            : []
    );
    const [budgetEntry, setBudgetEntry] = useState(new BudgetEntry(props.budgetEntry));
    const [duplicateBudgetEntry, setDuplicateBudgetEntry] = useState(new BudgetEntry(props.budgetEntry));

    useEffect(() => {
        const fetchBudgetEntryCategoryRules = async () => {
            setLoading(true);
            try {
                setBudgetEntryCategoryRules((await BudgetEntryCategoryRuleStore.FindMany({
                    criteria: {}
                })).records);
            } catch (e) {
                console.error(`error fetching budget entry category rules: ${e.message ? e.message : e.toString()}`)
            }
            setLoading(false);
        };
        if (!props.budgetEntryCategoryRules) {
            fetchBudgetEntryCategoryRules().finally();
        }
    }, [props.budgetEntryCategoryRules]);

    const handleFieldChange = (field: string) => (newValue: any) => {
        setBudgetEntry(new BudgetEntry({
            ...budgetEntry,
            [field]: newValue
        } as BudgetEntry));
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await BudgetEntryAdmin.UpdateOne({budgetEntry});
            if (props.onBudgetEntryUpdate) {
                props.onBudgetEntryUpdate(new BudgetEntry(budgetEntry));
            }
            setDuplicateBudgetEntry(new BudgetEntry(budgetEntry));
        } catch (e) {
            console.error('unable to update entry', e);
        }
        setLoading(false);
    };

    const handleCreate = async () => {
        setLoading(true);
        try {
            const createOneResponse = await BudgetEntryAdmin.CreateOne({budgetEntry});
            if (props.onBudgetEntryCreate) {
                props.onBudgetEntryCreate(new BudgetEntry(createOneResponse.budgetEntry));
            }
            setBudgetEntry(new BudgetEntry(createOneResponse.budgetEntry));
            setDuplicateBudgetEntry(new BudgetEntry(createOneResponse.budgetEntry));
        } catch (e) {
            console.error('unable to create entry', e);
        }
        setLoading(false);
    };

    const entryChanged = !_isEqual(budgetEntry, duplicateBudgetEntry);

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
                            Budget Entry
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
                            if (budgetEntry.id === '') {
                                handleCreate().finally();
                            } else {
                                handleUpdate().finally();
                            }
                        }}
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
                            disabled={loading}
                            value={moment(budgetEntry.date).format('YYYY-MM-DD')}
                            label={'Start Date'}
                            type={'date'}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => {
                                handleFieldChange('date')(`${e.target.value}T00:00:00Z`)
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            select
                            fullWidth
                            value={budgetEntry.categoryRuleID}
                            disabled={loading}
                            variant={'outlined'}
                            label={'Category'}
                            onChange={(e) => handleFieldChange('categoryRuleID')(e.target.value)}
                        >
                            {budgetEntryCategoryRules.map((bcr) => (
                                <MenuItem key={bcr.id} value={bcr.id}>
                                    {bcr.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth
                            label={'Description'}
                            multiline
                            rows={'3'}
                            rowsMax={'3'}
                            margin={'normal'}
                            variant={'outlined'}
                            InputLabelProps={{shrink: true}}
                            value={budgetEntry.description}
                            disabled={loading}
                            onChange={(e) => handleFieldChange('description')(e.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth
                            label={'Amount'}
                            margin={'normal'}
                            variant={'outlined'}
                            InputLabelProps={{shrink: true}}
                            value={budgetEntry.amount}
                            disabled={loading}
                            inputProps={{type: 'number'}}
                            onChange={(e) => handleFieldChange('amount')(+e.target.value)}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}