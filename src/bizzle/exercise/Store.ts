import {Query} from 'bizzle/search/query';
import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';
import Exercise from './Exercise';

interface FindManyRequest {
    criteria: any;
    query?: Query;
}

interface FindManyResponse {
    records: Exercise[];
    total: number;
}

const Store = {
    serviceProvider: 'Exercise-Store',
    async FindMany(request: FindManyRequest): Promise<FindManyResponse> {
        const response =  await jsonRPCRequest({
            url: config.get('exerciseURL'),
            method: `${Store.serviceProvider}.FindMany`,
            request
        });
        return {
            records: response.records.map((e: Exercise) => new Exercise(e)),
            total: response.total
        };
    }
};

export default Store;
