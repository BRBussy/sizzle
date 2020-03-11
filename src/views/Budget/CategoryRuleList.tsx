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
    Add as CreateIcon
} from '@material-ui/icons';
import {
    Card,
    CardContent,
    createStyles, Grid,
    IconButton, makeStyles, TextField, Theme, Tooltip
} from '@material-ui/core';
import {useAppContext} from 'context/App';

let fetchDataTimeout: any;

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gridRowGap: theme.spacing(1)
    },
    netCardRootOverride: {
        paddingTop: theme.spacing(0.5),
        paddingBottom: `${theme.spacing(0.5)}px !important`,
    },
    tableCardRootOverride: {
        padding: 0,
        paddingBottom: '0 !important',
    },
    textField: {
        width: 140,
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
            limit: 10,
            offset: 0,
            sorting: []
        })
    });
    const [budgetEntryDialogOpen, setBudgetEntryCategoryRuleDialogOpen] = useState(false);
    const [selectedBudgetEntries, setSelectedBudgetEntries] = useState<BudgetEntryCategoryRule[]>([]);
    const [refreshDataToggle, setRefreshDataToggle] = useState(false);
    const [tableHeight, setTableHeight] = useState(1);
    const [netValue, setNetValue] = useState(0);
    const [period, setPeriod] = useState(30);

    if (tableHeight !== document.documentElement.clientHeight - 128) {
        setTableHeight(document.documentElement.clientHeight - 128);
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                setBudgetEntryCategoryRuleFindManyResponse(await BudgetEntryCategoryRuleStore.FindMany(budgetEntryCategoryRuleFindManyRequest));
                setSelectedBudgetEntries([]);
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
            if (bcr.idealAmountPeriod === 0) {
                return;
            }
            net += (period / bcr.idealAmountPeriod) * bcr.idealAmount;
        });
        setNetValue(net);
    }, [period, budgetEntryFindManyResponse.records]);

    return (
        <div className={classes.root}>
            <Card classes={{root: classes.netCardRootOverride}}>
                <CardContent classes={{root: classes.netCardRootOverride}}>
                    <Grid container direction={'row'} spacing={1} alignItems={'center'} justify={'center'}>
                        <Grid item>
                            <TextField
                                className={classes.textField}
                                label={'Period'}
                                InputProps={{readOnly: true}}
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
                    if (selectedBudgetEntries.length === 1) {
                        return [
                            <Tooltip title='Edit'>
                                <IconButton
                                    size={'small'}
                                    onClick={() => setBudgetEntryCategoryRuleDialogOpen(true)}
                                >
                                    <EditIcon/>
                                </IconButton>
                            </Tooltip>
                        ];
                    } else if (selectedBudgetEntries.length > 1) {
                        return [];
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
                    setSelectedBudgetEntries(allSelectedData as BudgetEntryCategoryRule[])
                }
                columns={[
                    {
                        label: 'Name',
                        field: 'name'
                    },
                    {
                        label: 'Ideal Amount',
                        field: 'idealAmount'
                    },
                    {
                        label: 'Ideal Amount Period',
                        field: 'idealAmountPeriod'
                    }
                ]}
                data={budgetEntryFindManyResponse.records}
            />
            {budgetEntryDialogOpen &&
            <BudgetEntryCategoryRuleDialog
              budgetEntryCategoryRule={selectedBudgetEntries.length ? selectedBudgetEntries[0] : new BudgetEntryCategoryRule({
                  ...new BudgetEntryCategoryRule(),
                  ownerID: appContextLoginClaims.userID
              })}
              closeDialog={() => setBudgetEntryCategoryRuleDialogOpen(false)}
              onBudgetEntryCategoryRuleUpdate={() => setRefreshDataToggle(!refreshDataToggle)}
              onBudgetEntryCategoryRuleCreate={() => setRefreshDataToggle(!refreshDataToggle)}
            />}
        </div>
    );
};

export default EntryList;
