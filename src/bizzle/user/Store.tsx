import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';
import {User} from '.';
import {Query} from 'bizzle/search/query';
import {useEffect, useState} from 'react';


export interface FindManyRequest {
    criteria: any;
    query?: Query;
}

export interface FindManyResponse {
    records: User[];
    total: number;
}

const Store = {
    serviceProvider: 'User-Store',
    async FindMany(request: FindManyRequest): Promise<FindManyResponse> {
        const response = await jsonRPCRequest({
            url: config.get('userURL'),
            method: `${Store.serviceProvider}.FindMany`,
            request
        });
        return {
            records: response.records.map((be: User) => (new User(be))),
            total: response.total
        };
    }
};

export default Store;

let useUserStoreFindManyTimeout: any;

export function useUserStoreFindMany(initialFindManyRequest?: FindManyRequest) {
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
        clearTimeout(useUserStoreFindManyTimeout);
        useUserStoreFindManyTimeout = setTimeout(async () => {
            setLoading(true);
            setError(undefined);
            try {
                setFindManyResponse(await Store.FindMany(findManyRequest));
            } catch (e) {
                console.error(`error finding users: ${e.message ? e.message : e.toString()}`);
                setError(`error finding users: ${e.message ? e.message : e.toString()}`);
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
