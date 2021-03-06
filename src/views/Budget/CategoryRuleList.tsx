import {BudgetEntryCategoryRule, BudgetEntryCategoryRuleStore} from 'bizzle/budget/entry/categoryRule';
import {
    FindManyResponse as BudgetEntryCategoryRuleFindManyResponse,
    FindManyRequest as BudgetEntryCategoryRuleFindManyRequest
} from 'bizzle/budget/entry/categoryRule/Store';
import {Query} from 'bizzle/search/query';
import {BPTable} from 'components/Table';
import {SubstringFilter} from 'components/Table/BPTable/filters/text';
import React, {useEffect, useState} from 'react';
import {BudgetEntryCategoryRuleDialog} from 'components/Budget';
import {
    EditOutlined as EditIcon,
    Add as CreateIcon,
    ThumbDown as IgnoreIcon,
    ThumbUp as UnIgnoreIcon
} from '@material-ui/icons';
import {
    Card, CardContent, createStyles,
    Grid, IconButton, makeStyles, TextField,
    Theme, Tooltip
} from '@material-ui/core';
import {useAppContext} from 'context/App';

let fetchDataTimeout: any;

const useStyles = makeStyles((theme: Theme) => createStyles({
    netCardRootOverride: {
        paddingTop: theme.spacing(0.5),
        paddingBottom: `${theme.spacing(0.5)}px !important`
    },
    tableCardRootOverride: {
        padding: 0,
        paddingBottom: '0 !important'
    },
    textField: {
        width: 100
    },
    ignoredName: {
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        gridColumnGap: theme.spacing(1)
    }
}));

const EntryList = () => {
    const classes = useStyles();
    const {appContextLoginClaims} = useAppContext();
    const [loading, setLoading] = useState(false);
    const [budgetEntryFindManyResponse, setBudgetEntryCategoryRuleFindManyResponse] = useState<BudgetEntryCategoryRuleFindManyResponse>({
        records: [],
        total: 0
    });
    const [budgetEntryCategoryRuleFindManyRequest, setBudgetEntryCategoryRuleFindManyRequest] = useState<BudgetEntryCategoryRuleFindManyRequest>({
        criteria: {},
        query: new Query({
            limit: 30,
            offset: 0,
            sorting: []
        })
    });
    const [budgetEntryDialogOpen, setBudgetEntryCategoryRuleDialogOpen] = useState(false);
    const [selectedBudgetCategoryRules, setSelectedBudgetCategoryRules] = useState<BudgetEntryCategoryRule[]>([]);
    const [ignoredBudgetEntryCategoryRuleIDs, setIgnoredBudgetBudgetEntryCategoryRuleIDs] = useState<string[]>([]);
    const [refreshDataToggle, setRefreshDataToggle] = useState(false);
    const [tableHeight, setTableHeight] = useState(1);
    const [netValue, setNetValue] = useState('0');
    const [period, setPeriod] = useState(31);

    if (tableHeight !== document.documentElement.clientHeight - 140) {
        setTableHeight(document.documentElement.clientHeight - 140);
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                setBudgetEntryCategoryRuleFindManyResponse(await BudgetEntryCategoryRuleStore.FindMany(budgetEntryCategoryRuleFindManyRequest));
                setSelectedBudgetCategoryRules([]);
            } catch (e) {
                console.error('error finding budgetEntries', e);
            }
            setLoading(false);
        };
        clearTimeout(fetchDataTimeout);
        fetchDataTimeout = setTimeout(fetchData, 400);
    }, [budgetEntryCategoryRuleFindManyRequest, refreshDataToggle]);

    useEffect(() => {
        let net = 0;
        budgetEntryFindManyResponse.records.forEach((bcr) => {
            if (ignoredBudgetEntryCategoryRuleIDs.includes(bcr.id)) {
                return;
            }
            if (bcr.expectedAmountPeriod === 0) {
                return;
            }
            net += (period / bcr.expectedAmountPeriod) * bcr.expectedAmount;
        });
        setNetValue(net.toFixed(2));
    }, [period, budgetEntryFindManyResponse.records, ignoredBudgetEntryCategoryRuleIDs]);

    const handleIgnoreSelectedBudgetCategoryRules = () => {
        const updatedIgnoredBudgetCategoryRuleIDs = [...ignoredBudgetEntryCategoryRuleIDs];
        selectedBudgetCategoryRules.forEach((bcr) => {
            if (!ignoredBudgetEntryCategoryRuleIDs.includes(bcr.id)) {
                updatedIgnoredBudgetCategoryRuleIDs.push(bcr.id);
            }
        });
        if (ignoredBudgetEntryCategoryRuleIDs.length !== updatedIgnoredBudgetCategoryRuleIDs.length) {
            setIgnoredBudgetBudgetEntryCategoryRuleIDs(updatedIgnoredBudgetCategoryRuleIDs);
        }
    };

    const handleUnIgnoreBudgetCategoryRule = (bcrID: string) => () => {
        setIgnoredBudgetBudgetEntryCategoryRuleIDs(ignoredBudgetEntryCategoryRuleIDs.filter((id) => (id !== bcrID)));
    };

    return (
        <React.Fragment>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Card classes={{root: classes.netCardRootOverride}}>
                        <CardContent classes={{root: classes.netCardRootOverride}}>
                            <Grid container direction={'row'} spacing={1} alignItems={'center'} justify={'center'}>
                                <Grid item>
                                    <TextField
                                        className={classes.textField}
                                        label={'Period'}
                                        onChange={(e) => setPeriod(+e.target.value)}
                                        value={period}
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        className={classes.textField}
                                        label={'Net'}
                                        InputProps={{readOnly: true}}
                                        value={netValue}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <BPTable
                        height={tableHeight}
                        loading={loading}
                        title={'Category Rules'}
                        onQueryChange={(updatedQuery) => setBudgetEntryCategoryRuleFindManyRequest({
                            ...budgetEntryCategoryRuleFindManyRequest,
                            query: updatedQuery
                        })}
                        initialQuery={budgetEntryCategoryRuleFindManyRequest.query}
                        totalNoRecords={budgetEntryFindManyResponse.total}
                        filters={[
                            <SubstringFilter
                                onChange={(updatedCriteria) => setBudgetEntryCategoryRuleFindManyRequest({
                                    ...budgetEntryCategoryRuleFindManyRequest,
                                    criteria: updatedCriteria ? {description: updatedCriteria} : {}
                                })}
                            />
                        ]}
                        toolBarControls={(() => {
                            if (selectedBudgetCategoryRules.length === 1) {
                                return [
                                    <Tooltip title='Edit'>
                                        <IconButton
                                            size={'small'}
                                            onClick={() => setBudgetEntryCategoryRuleDialogOpen(true)}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                    </Tooltip>,
                                    <Tooltip title='Ignore'>
                                        <IconButton
                                            size={'small'}
                                            onClick={handleIgnoreSelectedBudgetCategoryRules}
                                        >
                                            <IgnoreIcon/>
                                        </IconButton>
                                    </Tooltip>
                                ];
                            } else if (selectedBudgetCategoryRules.length > 1) {
                                return [
                                    <Tooltip title='Ignore'>
                                        <IconButton
                                            size={'small'}
                                            onClick={handleIgnoreSelectedBudgetCategoryRules}
                                        >
                                            <IgnoreIcon/>
                                        </IconButton>
                                    </Tooltip>
                                ];
                            }
                            return [
                                <Tooltip title='Create'>
                                    <IconButton
                                        size={'small'}
                                        onClick={() => setBudgetEntryCategoryRuleDialogOpen(true)}
                                    >
                                        <CreateIcon/>
                                    </IconButton>
                                </Tooltip>
                            ]
                        })()}
                        onSelectedDataChange={(allSelectedData: { [key: string]: any }[]) =>
                            setSelectedBudgetCategoryRules(allSelectedData as BudgetEntryCategoryRule[])
                        }
                        columns={[
                            {
                                label: 'Name',
                                field: 'name',
                                minWidth: 200,
                                accessor: (data: any) => {
                                    const bcr = data as BudgetEntryCategoryRule;
                                    if (ignoredBudgetEntryCategoryRuleIDs.includes(bcr.id)) {
                                        return (
                                            <div className={classes.ignoredName}>
                                                <Tooltip title='Ignore'>
                                                    <IconButton
                                                        size={'small'}
                                                        onClick={handleUnIgnoreBudgetCategoryRule(bcr.id)}
                                                    >
                                                        <UnIgnoreIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                                <div>
                                                    {bcr.name}
                                                </div>
                                            </div>
                                        )
                                    }
                                    return bcr.name
                                }
                            },
                            {
                                label: 'Expected',
                                field: 'expectedAmount'
                            },
                            {
                                label: 'Period',
                                field: 'expectedAmountPeriod'
                            }
                        ]}
                        data={budgetEntryFindManyResponse.records}
                    />
                </Grid>
            </Grid>
            {budgetEntryDialogOpen &&
            <BudgetEntryCategoryRuleDialog
              budgetEntryCategoryRule={selectedBudgetCategoryRules.length ? selectedBudgetCategoryRules[0] : new BudgetEntryCategoryRule({
                  ...new BudgetEntryCategoryRule(),
                  ownerID: appContextLoginClaims.userID
              })}
              closeDialog={() => setBudgetEntryCategoryRuleDialogOpen(false)}
              onBudgetEntryCategoryRuleUpdate={() => setRefreshDataToggle(!refreshDataToggle)}
              onBudgetEntryCategoryRuleCreate={() => setRefreshDataToggle(!refreshDataToggle)}
            />}
        </React.Fragment>
    );
};

export default EntryList;
