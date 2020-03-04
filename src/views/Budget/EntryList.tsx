import {BudgetEntry, BudgetEntryStore} from 'bizzle/budget/entry';
import {
    FindManyResponse as BudgetEntryFindManyResponse,
    FindManyRequest as BudgetEntryFindManyRequest
} from 'bizzle/budget/entry/Store';
import TextSubstringCriterionType from 'bizzle/search/criterion/text/Substring';
import {Query} from 'bizzle/search/query';
import {BPTable} from 'components/Table';
import {SubstringFilter} from 'components/Table/BPTable/filters/text';
import React, {useEffect, useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core';
import moment from 'moment';
import {BudgetEntryCategoryRule, BudgetEntryCategoryRuleStore} from 'bizzle/budget/entry/categoryRule';

const useStyles = makeStyles((theme: Theme) => createStyles({
    muscleGroupFilterSelect: {
        width: 400
    }
}));

let fetchDataTimeout: any;

const EntryList = () => {
    const [loading, setLoading] = useState(false);
    const [budgetEntryFindManyResponse, setBudgetEntryFindManyResponse] = useState<BudgetEntryFindManyResponse>({
        records: [],
        total: 0
    });
    const [budgetEntryFindManyRequest, setBudgetEntryFindManyRequest] = useState<BudgetEntryFindManyRequest>({
        criteria: {},
        query: new Query({
            limit: 10,
            offset: 0,
            sorting: []
        })
    });
    const [budgetEntryCategoryRuleIdx, setBudgetEntryCategoryRuleIdx] = useState<{[key: string]: BudgetEntryCategoryRule}>({});

    useEffect(() => {
        const fetchBudgetEntryCategoryRules = async () => {
            setLoading(true);
            try {
                const newBudgetEntryCategoryRuleIdx: {[key: string]: BudgetEntryCategoryRule} = {};
                (await BudgetEntryCategoryRuleStore.FindMany({
                    criteria: {}
                })).records.forEach((bcr) => {
                    newBudgetEntryCategoryRuleIdx[bcr.id] = bcr;
                });
                setBudgetEntryCategoryRuleIdx(newBudgetEntryCategoryRuleIdx);
            } catch (e) {
                console.error(`error fetching budget entry category rules: ${e.message ? e.message : e.toString()}`)
            }
            setLoading(false);
        };
        fetchBudgetEntryCategoryRules().finally();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                setBudgetEntryFindManyResponse(await BudgetEntryStore.FindMany(budgetEntryFindManyRequest));
            } catch (e) {
                console.error('error finding budgetEntries', e);
            }
            setLoading(false);
        };
        clearTimeout(fetchDataTimeout);
        fetchDataTimeout = setTimeout(fetchData, 400);
    }, [budgetEntryFindManyRequest]);

    return (
        <BPTable
            loading={loading}
            title={'Budget Entries'}
            onQueryChange={(updatedQuery) => setBudgetEntryFindManyRequest({
                ...budgetEntryFindManyRequest,
                query: updatedQuery
            })}
            initialQuery={budgetEntryFindManyRequest.query}
            totalNoRecords={budgetEntryFindManyResponse.total}
            filters={[
                <SubstringFilter
                    onChange={(updatedCriteria) => setBudgetEntryFindManyRequest({
                        ...budgetEntryFindManyRequest,
                        criteria: updatedCriteria ? {description: updatedCriteria} : {}
                    })}
                />
            ]}
            columns={[
                {
                    label: 'Date',
                    field: 'date',
                    minWidth: 100,
                    accessor: (data: any) => {
                        const be = data as BudgetEntry;
                        return moment(be.date).format('YY-MM-DD')
                    }
                },
                {
                    label: 'Category',
                    field: 'categoryRuleID',
                    minWidth: 150,
                    accessor: (data: any) => {
                        const be = data as BudgetEntry;
                        return budgetEntryCategoryRuleIdx[be.categoryRuleID]
                            ? budgetEntryCategoryRuleIdx[be.categoryRuleID].name
                            : '-';
                    }
                },
                {
                    label: 'Description',
                    field: 'description',
                    minWidth: 200
                },
                {
                    field: 'amount',
                    label: 'Amount'
                }
            ]}
            data={budgetEntryFindManyResponse.records}
        />
    );
};

export default EntryList;
