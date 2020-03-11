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
    IconButton, Tooltip
} from '@material-ui/core';
import {useAppContext} from 'context/App';

let fetchDataTimeout: any;

const EntryList = () => {
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

    return (
        <React.Fragment>
            <BPTable
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
        </React.Fragment>
    );
};

export default EntryList;
