import React, { useState, useEffect } from 'react';
import {
    makeStyles, Theme, createStyles, Grid, TextField,
    Card, CardContent, AppBar, Tabs, Tab, CardHeader
} from '@material-ui/core';
import { Budget, BudgetAdmin } from 'bizzle/budget';
import { BudgetEntry} from 'bizzle/budget/entry';
import { FETable } from 'components/Table';
import moment from 'moment';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gridRowGap: theme.spacing(1)
    }
}));

let getBudgetForDateRangeTimeout: any;

const ViewBudgets = () => {
    const classes = useStyles();
    const [startDate, setStartDate] = useState<string | undefined>(undefined);
    const [endDate, setEndDate] = useState<string | undefined>(undefined);
    const [budget, setBudget] = useState<Budget | undefined>(undefined);
    const [selectedBudgetTab, setSelectedBudgetTab] = useState('Summary');

    useEffect(() => {
        const getBudgetForDateRange = async () => {
            if (!(startDate && endDate)) {
                return;
            }
            try {
                setBudget((await BudgetAdmin.GetBudgetForDateRange({
                    startDate: `${startDate}T00:00:00Z`,
                    endDate: `${endDate}T00:00:00Z`
                })).budget);
            } catch (e) {
                console.error(`error getting budget for date range: ${e.message ? e.message : e.toString()}`)
            }
        };
        clearTimeout(getBudgetForDateRangeTimeout);
        getBudgetForDateRangeTimeout = setTimeout(getBudgetForDateRange, 400);
    }, [startDate, endDate]);

    const handleSelectedBudgetTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedBudgetTab(newValue);
    };

    return (
        <div className={classes.root}>
            <Card>
                <CardContent>
                    <Grid container direction={'row'} spacing={1}>
                        <Grid item>
                            <TextField
                                label={'Start Date'}
                                type={'date'}
                                InputLabelProps={{ shrink: true }}
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
                                InputLabelProps={{ shrink: true }}
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
                </CardContent>
            </Card>
            {budget &&
                <Card>
                    <CardHeader
                        title={
                            <AppBar position='static'>
                                <Tabs
                                    value={selectedBudgetTab}
                                    onChange={handleSelectedBudgetTabChange}
                                    variant={'scrollable'}
                                    scrollButtons={'auto'}
                                >
                                    <Tab label={'Summary'} value={'Summary'} />
                                    {Object.keys(budget.entries).map((budgetEntryCategory, idx) => (
                                        <Tab key={idx} label={budgetEntryCategory} value={budgetEntryCategory} />
                                    ))}
                                </Tabs>
                            </AppBar>
                        }
                    />
                    <CardContent>
                        {(() => {
                            if (selectedBudgetTab === 'Summary') {
                                return (
                                    <FETable
                                        height={435}
                                        columns={[
                                            {
                                                label: 'Item',
                                                field: 'summaryLabel'
                                            },
                                            {
                                                label: 'Amount',
                                                field: 'amount'
                                            }
                                        ]}
                                        data={Object.keys(budget.summary).map((summaryLabel) => ({
                                            summaryLabel,
                                            amount: budget.summary[summaryLabel]
                                        }))}
                                        title={''}
                                    />
                                );
                            } else {
                                return (
                                    <FETable
                                        height={435}
                                        columns={[
                                            {
                                                label: 'Date',
                                                field: 'date'
                                            },
                                            {
                                                label: 'Date',
                                                field: 'date',
                                                accessor: (data: any) => {
                                                    const be = data as BudgetEntry;
                                                    try {
                                                        return moment(be.date).format('YY-MM-DD');
                                                    } catch (e) {
                                                        console.error('error formatting date:', e);
                                                        return '-';
                                                    }
                                                }
                                            },
                                            {
                                                label: 'Description',
                                                field: 'description'
                                            },
                                            {
                                                label: 'Amount',
                                                field: 'amount'
                                            }
                                        ]}
                                        data={budget.entries[selectedBudgetTab]}
                                        title={''}
                                    />
                                );
                            }
                        })()}
                    </CardContent>
                </Card>}
        </div>
    )
};

export default ViewBudgets;