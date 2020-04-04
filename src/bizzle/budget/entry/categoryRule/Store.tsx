import {Query} from 'bizzle/search/query';
import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';
import CategoryRule from './CategoryRule';
import {useEffect, useState} from 'react';

export interface FindManyRequest {
    criteria: any;
    query?: Query;
}

export interface FindManyResponse {
    records: CategoryRule[];
    total: number;
}

const Store = {
    serviceProvider: 'BudgetEntryCategoryRule-Store',
    async FindMany(request: FindManyRequest): Promise<FindManyResponse> {
        const response = await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Store.serviceProvider}.FindMany`,
            request
        });
        return {
            records: response.records.map((e: CategoryRule) => new CategoryRule(e)),
            total: response.total
        };
    }
};

let useBudgetEntryCategoryRuleStoreFindManyTimeout: any;

export function useBudgetEntryCategoryRuleStoreFindMany(initialFindManyRequest?: FindManyRequest) {
    const [findManyRequest, setFindManyRequest] = useState<FindManyRequest>(initialFindManyRequest
        ? initialFindManyRequest
        : {
            criteria: {},
            query: new Query()
        }
    );
    const [findManyResponse, setFindManyResponse] = useState<FindManyResponse>({
        records: [],
        total: 0
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        clearTimeout(useBudgetEntryCategoryRuleStoreFindManyTimeout);
        useBudgetEntryCategoryRuleStoreFindManyTimeout = setTimeout(async () => {
            setLoading(true);
            setError(undefined);
            try {
                setFindManyResponse(await Store.FindMany(findManyRequest));
            } catch (e) {
                console.error(`error finding budget category rule entries: ${e.message ? e.message : e.toString()}`);
                setError(`error finding budget category rule entries: ${e.message ? e.message : e.toString()}`);
            }
            setLoading(false);
        }, 400)
    }, [findManyRequest]);

    return {
        findManyRequest,
        setFindManyRequest,
        findManyResponse,
        setFindManyResponse,
        loading,
        error
    }
}

export default Store;
