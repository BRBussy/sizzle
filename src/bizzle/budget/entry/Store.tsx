import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';
import {BudgetEntry} from '.';
import {Query} from 'bizzle/search/query';
import {useEffect, useState} from 'react';


export interface FindManyRequest {
    criteria: any;
    query?: Query;
}

export interface FindManyResponse {
    records: BudgetEntry[];
    total: number;
}

const Store = {
    serviceProvider: 'BudgetEntry-Store',
    async FindMany(request: FindManyRequest): Promise<FindManyResponse> {
        const response = await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Store.serviceProvider}.FindMany`,
            request
        });
        return {
            records: response.records.map((be: BudgetEntry) => (new BudgetEntry(be))),
            total: response.total
        };
    }
};

export default Store;

let useBudgetEntryStoreFindManyTimeout: any;

export function useBudgetEntryStoreFindMany(initialFindManyRequest?: FindManyRequest) {
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
        clearTimeout(useBudgetEntryStoreFindManyTimeout);
        useBudgetEntryStoreFindManyTimeout = setTimeout(async () => {
            setLoading(true);
            setError(undefined);
            try {
                setFindManyResponse(await Store.FindMany(findManyRequest));
            } catch (e) {
                console.error(`error finding budget entries: ${e.message ? e.message : e.toString()}`);
                setError(`error finding budget entries: ${e.message ? e.message : e.toString()}`);
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
