import React, {useState, useEffect} from 'react';
import {
    makeStyles, Theme, createStyles, Grid, TextField,
    Card, CardContent, AppBar, Tabs, Tab, CardHeader,
    IconButton,
    CircularProgress,
    Toolbar, Collapse, MenuItem
} from '@material-ui/core';
import {Budget, BudgetAdmin} from 'bizzle/budget';
import {BudgetConfigAdmin} from 'bizzle/budget/config';
import {BudgetEntry, BudgetEntryAdmin, BudgetEntryStore} from 'bizzle/budget/entry';
import {FETable} from 'components/Table';
import moment from 'moment';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    KeyboardArrowUp as OutIcon,
    KeyboardArrowDown as InIcon,
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon
} from '@material-ui/icons';
import {BudgetEntryDialog} from 'components/Budget';
import {IDIdentifier} from 'bizzle/search/identifier';
import {CategoryTotal} from 'bizzle/budget/Budget';
import {Query} from 'bizzle/search/query';
import {TextExact} from 'bizzle/search/criterion/text';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: 'grid',
        gridTemplateRows: 'auto auto auto',
        gridRowGap: theme.spacing(0.5)
    },
    dateField: {
        width: 130
    },
    dateSelectCardRootOverride: {
        paddingTop: theme.spacing(0.5),
        paddingBottom: `${theme.spacing(0.5)}px !important`,
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'repeat(2, auto)'
    },
    dateRangeSelectLayout: {
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(1),
        paddingTop: theme.spacing(0.5)
    },
    tableCardRootOverride: {
        padding: 0,
        paddingBottom: '0 !important'
    },
    totalLayout: {
        display: 'grid',
        gridTemplateColumns: 'auto auto'
    },
    out: {
        color: theme.palette.error.main
    },
    in: {
        color: theme.palette.success.main
    }
}));

let getBudgetForDateRangeTimeout: any;

const Summary = () => {
    const classes = useStyles();
    const [startDate, setStartDate] = useState<string | undefined>(undefined);
    const [endDate, setEndDate] = useState<string | undefined>(undefined);
    const [budget, setBudget] = useState<Budget | undefined>(undefined);
    const [selectedBudgetTab, setSelectedBudgetTab] = useState('Summary');
    const [appBarWidth, setAppBarWidth] = useState(0);
    const [tableHeight, setTableHeight] = useState(1);
    const [selectedBudgetEntry, setSelectedBudgetEntry] = useState<BudgetEntry | undefined>(undefined);
    const [refreshToggle, setRefreshToggle] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dateRangeSelectOpen, setDateRangeSelectOpen] = useState(false);
    const [possibleDateRanges, setPossibleDateRanges] = useState<{ startDate: string, endDate: string, id: string }[]>([]);
    const [selectedDateRange, setSelectedDateRange] = useState('');

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                // retrieve my budget config
                const myBudgetConfig = (await BudgetConfigAdmin.GetMyConfig({})).budgetConfig;

                // if the summary date period category rule is not yet set on the config use a default date range
                if (myBudgetConfig.summaryDatePeriodCategoryRuleID === '') {
                    setStartDate(moment().subtract(1, 'month').format('YYYY-MM-DD'));
                    setEndDate(moment().add(1, 'day').format('YYYY-MM-DD'));
                    setLoading(false);
                    return;
                }

                // otherwise retrieve all the budget entries at this category rule
                const dateRangeSummaryRuleBudgetEntries = (await BudgetEntryStore.FindMany({
                    query: new Query({
                        ...new Query(),
                        sorting: [
                            {
                                field: 'date',
                                sortOrder: 'desc'
                            }
                        ]
                    }),
                    criteria: {
                        categoryRuleID: TextExact(myBudgetConfig.summaryDatePeriodCategoryRuleID)
                    }
                })).records;

                // if no records returned use a default date range
                if (!dateRangeSummaryRuleBudgetEntries.length) {
                    setStartDate(moment().subtract(1, 'month').format('YYYY-MM-DD'));
                    setEndDate(moment().add(1, 'day').format('YYYY-MM-DD'));
                    setLoading(false);
                    return;
                }

                // otherwise set date range from the date of the latest entry to now
                setStartDate(moment(dateRangeSummaryRuleBudgetEntries[0].date).format('YYYY-MM-DD'));
                setEndDate(moment().format('YYYY-MM-DD'));

                // generate list of possible date ranges
                const newPossibleDateRanges: { startDate: string, endDate: string, id: string }[] = [];
                for (let i = dateRangeSummaryRuleBudgetEntries.length - 1; i > -1; i--) {
                    if (i === 0) {
                        newPossibleDateRanges.push({
                            id: `${dateRangeSummaryRuleBudgetEntries[i].date}-${moment().format('YYYY-MM-DD')}`,
                            startDate: moment(dateRangeSummaryRuleBudgetEntries[i].date).format('YYYY-MM-DD'),
                            endDate: moment().format('YYYY-MM-DD')
                        });
                    } else {
                        newPossibleDateRanges.push({
                            id: `${dateRangeSummaryRuleBudgetEntries[i].date}-${dateRangeSummaryRuleBudgetEntries[i - 1].date}`,
                            startDate: moment(dateRangeSummaryRuleBudgetEntries[i].date).format('YYYY-MM-DD'),
                            endDate: moment(dateRangeSummaryRuleBudgetEntries[i - 1].date).subtract(1, 'day').format('YYYY-MM-DD')
                        });
                    }
                }
                setPossibleDateRanges(newPossibleDateRanges);
            } catch (e) {
                console.error(`error getting my budget config: ${e.message ? e.message : e.toString()}`);
            }
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        const getBudgetForDateRange = async () => {
            if (!(startDate && endDate)) {
                return;
            }
            setLoading(true);
            try {
                setBudget((await BudgetAdmin.GetBudgetForDateRange({
                    startDate: `${startDate}T00:00:00Z`,
                    endDate: `${endDate}T00:00:00Z`
                })).budget);
            } catch (e) {
                console.error(`error getting budget for date range: ${e.message ? e.message : e.toString()}`);
            }
            setLoading(false);
        };
        clearTimeout(getBudgetForDateRangeTimeout);
        getBudgetForDateRangeTimeout = setTimeout(getBudgetForDateRange, 400);
    }, [startDate, endDate, refreshToggle]);

    const handleSelectedBudgetTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedBudgetTab(newValue);
    };

    const expectedTableHeight = dateRangeSelectOpen
        ? document.documentElement.clientHeight - 214
        : document.documentElement.clientHeight - 160
    if (tableHeight !== expectedTableHeight) {
        setTableHeight(expectedTableHeight);
    }

    const handleDeleteOneBudgetEntry = (budgetEntry: BudgetEntry) => async () => {
        setLoading(true);
        try {
            await BudgetEntryAdmin.DeleteOne({
                identifier: IDIdentifier(budgetEntry.id)
            });
            setRefreshToggle(!refreshToggle);
        } catch (e) {
            console.error(`error getting budget for date range: ${e.message ? e.message : e.toString()}`)
        }
        setLoading(false);
    };

    const handleSelectedDateRangeChange = (selectedDateRangeValue: string) => {
      const selectedPossibleDateRange = possibleDateRanges.find((pdr) => (pdr.id === selectedDateRangeValue));
      if (!selectedPossibleDateRange) {
          console.error('unable to find selected date range');
          return;
      }
      setStartDate(selectedPossibleDateRange.startDate);
      setEndDate(selectedPossibleDateRange.endDate);
      setSelectedDateRange(selectedDateRangeValue);
    };

    return (
        <div className={classes.root}>
            <Card classes={{root: classes.dateSelectCardRootOverride}}>
                <CardContent classes={{root: classes.dateSelectCardRootOverride}}>
                    <Grid container direction={'row'} spacing={1} alignItems={'center'} justify={'center'}>
                        <Grid item>
                            <IconButton
                                size={'small'}
                                onClick={() => setDateRangeSelectOpen(!dateRangeSelectOpen)}
                            >
                                {dateRangeSelectOpen
                                    ? (<ExpandLessIcon/>)
                                    : (<ExpandMoreIcon/>)
                                }
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <TextField
                                className={classes.dateField}
                                value={startDate ? startDate : ''}
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
                                className={classes.dateField}
                                value={endDate ? endDate : ''}
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
                        {loading &&
                        <Grid item>
                            <CircularProgress size={30}/>
                        </Grid>}
                    </Grid>
                    <Collapse in={dateRangeSelectOpen}>
                        <div className={classes.dateRangeSelectLayout}>
                            <TextField
                                fullWidth
                                margin={'dense'}
                                select
                                value={selectedDateRange}
                                onChange={(e) => handleSelectedDateRangeChange(e.target.value)}
                            >
                                {possibleDateRanges.map((pdr, idx) => (
                                    <MenuItem key={idx} value={pdr.id}>
                                        {`${pdr.startDate} - ${pdr.endDate}`}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    </Collapse>
                </CardContent>
            </Card>
            {!loading && budget &&
            <React.Fragment>
                <Card classes={{root: classes.tableCardRootOverride}}>
                    <CardHeader
                        classes={{root: classes.tableCardRootOverride}}
                        ref={(cardHeaderRef: HTMLDivElement) => {
                            if (!cardHeaderRef) {
                                return;
                            }
                            if (cardHeaderRef.clientWidth !== appBarWidth) {
                                setAppBarWidth(cardHeaderRef.clientWidth);
                            }
                        }}
                        title={
                            <AppBar
                                position={'static'}
                                style={{width: appBarWidth}}
                            >
                                <Toolbar variant={'dense'} disableGutters>
                                    <Tabs
                                        value={selectedBudgetTab}
                                        onChange={handleSelectedBudgetTabChange}
                                        variant={'scrollable'}
                                        scrollButtons={'on'}
                                    >
                                        <Tab label={'Summary'} value={'Summary'}/>
                                        {Object.keys(budget.entries).map((budgetEntryCategory, idx) => (
                                            <Tab key={idx} label={budgetEntryCategory} value={budgetEntryCategory}/>
                                        ))}
                                    </Tabs>
                                </Toolbar>
                            </AppBar>
                        }
                    />
                    <CardContent classes={{root: classes.tableCardRootOverride}}>
                        {(() => {
                            if (selectedBudgetTab === 'Summary') {
                                return (
                                    <FETable
                                        height={tableHeight}
                                        initialRowsPerPage={20}
                                        columns={[
                                            {
                                                label: 'Item',
                                                field: 'summaryLabel'
                                            },
                                            {
                                                label: 'Amount',
                                                field: 'amount',
                                                accessor: (data: any) => {
                                                    const summaryItem = data as {
                                                        summaryLabel: string,
                                                        categoryTotal: CategoryTotal
                                                    };
                                                    let className;
                                                    const actualGreaterThanExpected = Math.abs(summaryItem.categoryTotal.amount) > Math.abs(summaryItem.categoryTotal.budgetEntryCategoryRule.expectedAmount);
                                                    const expectedPositive = summaryItem.categoryTotal.budgetEntryCategoryRule.expectedAmount > 0;
                                                    if (expectedPositive) {
                                                        if (actualGreaterThanExpected) {
                                                            className = classes.in;
                                                        } else {
                                                            className = classes.out;
                                                        }
                                                    } else {
                                                        // expected negative
                                                        if (actualGreaterThanExpected) {
                                                            className = classes.out;
                                                        } else {
                                                            className = classes.in;
                                                        }
                                                    }
                                                    return (
                                                        <div className={className}>
                                                            {`${summaryItem.categoryTotal.amount} / ${summaryItem.categoryTotal.budgetEntryCategoryRule.expectedAmount}`}
                                                        </div>
                                                    );
                                                }
                                            }
                                        ]}
                                        data={Object.keys(budget.summary).map((summaryLabel) => ({
                                            summaryLabel,
                                            categoryTotal: budget.summary[summaryLabel]
                                        }))}
                                        title={''}
                                    />
                                );
                            } else {
                                return (
                                    <FETable
                                        height={tableHeight}
                                        initialRowsPerPage={20}
                                        columns={[
                                            {
                                                label: 'Date',
                                                field: 'date',
                                                minWidth: 100,
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
                                                field: 'description',
                                                minWidth: 200
                                            },
                                            {
                                                label: 'Amount',
                                                field: 'amount'
                                            },
                                            {
                                                label: '',
                                                accessor: (data: any) => {
                                                    return (
                                                        <IconButton
                                                            size={'small'}
                                                            onClick={() => setSelectedBudgetEntry(data as BudgetEntry)}
                                                        >
                                                            <EditIcon/>
                                                        </IconButton>
                                                    );
                                                }
                                            },
                                            {
                                                label: '',
                                                accessor: (data: any) => {
                                                    return (
                                                        <IconButton
                                                            size={'small'}
                                                            onClick={handleDeleteOneBudgetEntry(data as BudgetEntry)}
                                                        >
                                                            <DeleteIcon/>
                                                        </IconButton>
                                                    );
                                                }
                                            }
                                        ]}
                                        data={budget.entries[selectedBudgetTab]}
                                        title={''}
                                    />
                                );
                            }
                        })()}
                    </CardContent>
                </Card>
                <Card classes={{root: classes.dateSelectCardRootOverride}}>
                    <CardContent classes={{root: classes.dateSelectCardRootOverride}}>
                        <Grid container direction={'row'} spacing={1} alignItems={'center'} justify={'center'}>
                            <Grid item>
                                <div className={classes.totalLayout}>
                                    <InIcon className={classes.in}/>
                                    <div className={classes.in}>
                                        {budget.totalIn.actual}
                                    </div>
                                </div>
                            </Grid>
                            <Grid item>
                                <div className={classes.totalLayout}>
                                    <OutIcon className={classes.out}/>
                                    <div className={classes.out}>
                                        {budget.totalOut.actual}
                                    </div>
                                </div>
                            </Grid>
                            <Grid item>
                                <div>
                                    Net:
                                </div>
                            </Grid>
                            <Grid item>
                                {budget.net >= 0
                                    ? (
                                        <div className={classes.totalLayout}>
                                            <InIcon className={classes.in}/>
                                            <div className={classes.in}>
                                                {budget.net}
                                            </div>
                                        </div>
                                    )
                                    : (
                                        <div className={classes.totalLayout}>
                                            <OutIcon className={classes.out}/>
                                            <div className={classes.out}>
                                                {budget.net}
                                            </div>
                                        </div>
                                    )
                                }
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </React.Fragment>}
            {!!selectedBudgetEntry &&
            <BudgetEntryDialog
                closeDialog={() => setSelectedBudgetEntry(undefined)}
                onBudgetEntryUpdate={() => setRefreshToggle(!refreshToggle)}
                budgetEntry={selectedBudgetEntry}
            />}
        </div>
    )
};

export default Summary;