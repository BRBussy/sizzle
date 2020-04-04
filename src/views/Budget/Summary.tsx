import React, {useState, useEffect} from 'react';
import {
    makeStyles, Theme, createStyles, Grid, TextField,
    Card, CardContent, AppBar, Tabs, Tab, CardHeader,
    IconButton,
    CircularProgress
} from '@material-ui/core';
import {Budget, BudgetAdmin} from 'bizzle/budget';
import {BudgetEntry, BudgetEntryAdmin} from 'bizzle/budget/entry';
import {FETable} from 'components/Table';
import moment from 'moment';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    KeyboardArrowUp as OutIcon,
    KeyboardArrowDown as InIcon
} from '@material-ui/icons';
import {BudgetEntryDialog} from 'components/Budget';
import {IDIdentifier} from 'bizzle/search/identifier';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: 'grid',
        gridTemplateRows: 'auto auto auto',
        gridRowGap: theme.spacing(0.5)
    },
    dateField: {
        width: 140
    },
    dateSelectCardRootOverride: {
        paddingTop: theme.spacing(0.5),
        paddingBottom: `${theme.spacing(0.5)}px !important`
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
    const [startDate, setStartDate] = useState<string | undefined>(moment().subtract(1, 'month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState<string | undefined>(moment().add(1, 'day').format('YYYY-MM-DD'));
    const [budget, setBudget] = useState<Budget | undefined>(undefined);
    const [selectedBudgetTab, setSelectedBudgetTab] = useState('Summary');
    const [appBarWidth, setAppBarWidth] = useState(0);
    const [tableHeight, setTableHeight] = useState(1);
    const [selectedBudgetEntry, setSelectedBudgetEntry] = useState<BudgetEntry | undefined>(undefined);
    const [refreshToggle, setRefreshToggle] = useState(false);
    const [loading, setLoading] = useState(false);

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
                console.error(`error getting budget for date range: ${e.message ? e.message : e.toString()}`)
            }
            setLoading(false);
        };
        clearTimeout(getBudgetForDateRangeTimeout);
        getBudgetForDateRangeTimeout = setTimeout(getBudgetForDateRange, 400);
    }, [startDate, endDate, refreshToggle]);

    const handleSelectedBudgetTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedBudgetTab(newValue);
    };

    if (tableHeight !== document.documentElement.clientHeight - 160) {
        setTableHeight(document.documentElement.clientHeight - 160);
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

    return (
        <div className={classes.root}>
            <Card classes={{root: classes.dateSelectCardRootOverride}}>
                <CardContent classes={{root: classes.dateSelectCardRootOverride}}>
                    <Grid container direction={'row'} spacing={1} alignItems={'center'} justify={'center'}>
                        <Grid item>
                            <TextField
                                className={classes.dateField}
                                value={startDate}
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
                                value={endDate}
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
                      <AppBar position='static' style={{width: appBarWidth}}>
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