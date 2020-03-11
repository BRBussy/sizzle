import React, {useState} from 'react';
import {
    Dialog, DialogTitle, DialogContent, Grid,
    makeStyles, Theme, TextField, Typography, CircularProgress,
    IconButton
} from '@material-ui/core';
import {BudgetEntryCategoryRule, BudgetEntryCategoryRuleAdmin} from 'bizzle/budget/entry/categoryRule';
import {
    Close as CloseIcon,
    Save as SaveIcon
} from '@material-ui/icons';
import {isEqual as _isEqual} from 'lodash';

interface EntryDialogProps {
    closeDialog: () => void;
    budgetEntryCategoryRule: BudgetEntryCategoryRule;
    onBudgetEntryCategoryRuleUpdate?: (updatedBudgetEntry: BudgetEntryCategoryRule) => void;
    onBudgetEntryCategoryRuleCreate?: (newBudgetEntry: BudgetEntryCategoryRule) => void;
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
    const [budgetEntryCategoryRule, setBudgetEntryCategoryRule] = useState(new BudgetEntryCategoryRule(props.budgetEntryCategoryRule));
    const [duplicateBudgetEntryCategoryRule, setDuplicateBudgetEntryCategoryRule] = useState(new BudgetEntryCategoryRule(props.budgetEntryCategoryRule));

    const handleFieldChange = (field: string) => (newValue: any) => {
        setBudgetEntryCategoryRule(new BudgetEntryCategoryRule({
            ...budgetEntryCategoryRule,
            [field]: newValue
        } as BudgetEntryCategoryRule));
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await BudgetEntryCategoryRuleAdmin.UpdateOne({categoryRule: budgetEntryCategoryRule});
            if (props.onBudgetEntryCategoryRuleUpdate) {
                props.onBudgetEntryCategoryRuleUpdate(new BudgetEntryCategoryRule(budgetEntryCategoryRule));
            }
            setDuplicateBudgetEntryCategoryRule(new BudgetEntryCategoryRule(budgetEntryCategoryRule));
        } catch (e) {
            console.error('unable to update category rule', e);
        }
        setLoading(false);
    };

    const handleCreate = async () => {
        setLoading(true);
        try {
            const createOneResponse = await BudgetEntryCategoryRuleAdmin.CreateOne({categoryRule: budgetEntryCategoryRule});
            if (props.onBudgetEntryCategoryRuleCreate) {
                props.onBudgetEntryCategoryRuleCreate(new BudgetEntryCategoryRule(createOneResponse.categoryRule));
            }
            setBudgetEntryCategoryRule(new BudgetEntryCategoryRule(createOneResponse.categoryRule));
            setDuplicateBudgetEntryCategoryRule(new BudgetEntryCategoryRule(createOneResponse.categoryRule));
        } catch (e) {
            console.error('unable to create category rule', e);
        }
        setLoading(false);
    };

    const entryChanged = !_isEqual(budgetEntryCategoryRule, duplicateBudgetEntryCategoryRule);

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
                            Category RUle
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
                            if (budgetEntryCategoryRule.id === '') {
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
                            value={budgetEntryCategoryRule.name}
                            label={'Name'}
                            type={'name'}
                            InputLabelProps={{shrink: true}}
                            onChange={(e) => {
                                handleFieldChange('name')(e.target.value)
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth
                            label={'Ideal Amount'}
                            margin={'normal'}
                            variant={'outlined'}
                            InputLabelProps={{shrink: true}}
                            value={budgetEntryCategoryRule.expectedAmount}
                            disabled={loading}
                            inputProps={{type: 'number'}}
                            onChange={(e) => handleFieldChange('idealAmount')(+e.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth
                            label={'Ideal Amount Period'}
                            margin={'normal'}
                            variant={'outlined'}
                            InputLabelProps={{shrink: true}}
                            value={budgetEntryCategoryRule.expectedAmountPeriod}
                            disabled={loading}
                            inputProps={{type: 'number'}}
                            onChange={(e) => handleFieldChange('idealAmountPeriod')(+e.target.value)}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}