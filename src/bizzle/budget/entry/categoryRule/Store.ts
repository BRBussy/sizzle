import {Query} from 'bizzle/search/query';
import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';
import CategoryRule from './CategoryRule';

interface FindManyRequest {
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
        const response =  await jsonRPCRequest({
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

export default Store;
