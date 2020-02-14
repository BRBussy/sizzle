import React, {useState, useEffect} from 'react';
import {
    makeStyles, Theme, createStyles, Grid, TextField
} from '@material-ui/core';
import {BudgetAdmin} from 'bizzle/budget';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {}
}));

let getBudgetForDateRangeTimeout: any;

const ViewBudgets = () => {
    const classes = useStyles();
    const [startDate, setStartDate] = useState<string | undefined>(undefined);
    const [endDate, setEndDate] = useState<string | undefined>(undefined);

    useEffect(() => {
        const getBudgetForDateRange = async () => {
            if (!(startDate && endDate)) {
                return;
            }
            try {
                await BudgetAdmin.GetBudgetForDateRange({
                    startDate: `${startDate}T00:00:00Z`,
                    endDate: `${endDate}T00:00:00Z`
                });
            } catch (e) {
                console.error(`error getting budget for date range: ${e.message ? e.message : e.toString()}`)
            }
        };
        clearTimeout(getBudgetForDateRangeTimeout);
        getBudgetForDateRangeTimeout = setTimeout(getBudgetForDateRange, 400);
    }, [startDate, endDate]);

    return (
        <div className={classes.root}>
            <Grid container direction={'row'} spacing={1}>
                <Grid item>
                    <TextField
                        label={'Start Date'}
                        type={'date'}
                        InputLabelProps={{shrink: true}}
                        onChange={(e) => {
                            if (!e.target.value || e.target.value === '') {
                                setStartDate(undefined);
                            } else {
                                setStartDate(e.target.value);
                            }
                        }}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label={'End Date'}
                        type={'date'}
                        InputLabelProps={{shrink: true}}
                        onChange={(e) => {
                            if (!e.target.value || e.target.value === '') {
                                setEndDate(undefined);
                            } else {
                                setEndDate(e.target.value);
                            }
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    )
};

export default ViewBudgets;