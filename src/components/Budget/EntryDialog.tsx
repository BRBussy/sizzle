import React, {useEffect, useState} from 'react';
import {
    Dialog, DialogTitle, DialogContent, Grid,
    makeStyles, Theme, TextField
} from '@material-ui/core';
import {BudgetEntryCategoryRule, BudgetEntryCategoryRuleStore} from 'bizzle/budget/entry/categoryRule';


interface EntryDialogProps {
    closeDialog: () => void;
    initialAppState?: EntryDialogAppState;
    budgetEntryCategoryRules?: BudgetEntryCategoryRule[];
}

const useStyles = makeStyles((theme: Theme) => ({}));

export enum EntryDialogAppState {
    view,
    edit
}

export default function EntryDialog(props: EntryDialogProps) {
    const [loading, setLoading] = useState(false);
    const [appState, setAppState] = useState(props.initialAppState
        ? props.initialAppState
        : EntryDialogAppState.view
    );
    const [budgetEntryCategoryRules, setBudgetEntryCategoryRules] = useState<BudgetEntryCategoryRule[]>(
        props.budgetEntryCategoryRules
            ? props.budgetEntryCategoryRules
            : []
    );

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

    return (
        <Dialog
            open={true}
            onClose={props.closeDialog}
        >
            <DialogTitle>Budget Entry</DialogTitle>
            <DialogContent>
                <Grid container direction={'column'} spacing={1}>
                    <Grid item>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}