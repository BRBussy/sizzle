import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';
import {BudgetEntry} from '.';
import {Query} from 'bizzle/search/query';


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
