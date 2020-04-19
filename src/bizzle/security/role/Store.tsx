import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';
import {Role} from '.';
import {Query} from 'bizzle/search/query';
import {useEffect, useState} from 'react';


export interface FindManyRequest {
    criteria: any;
    query?: Query;
}

export interface FindManyResponse {
    records: Role[];
    total: number;
}

const Store = {
    serviceProvider: 'Role-Store',
    async FindMany(request: FindManyRequest): Promise<FindManyResponse> {
        const response = await jsonRPCRequest({
            url: config.get('roleURL'),
            method: `${Store.serviceProvider}.FindMany`,
            request
        });
        return {
            records: response.records.map((be: Role) => (new Role(be))),
            total: response.total
        };
    }
};

export default Store;

let useRoleStoreFindManyTimeout: any;

export function useRoleStoreFindMany(initialFindManyRequest?: FindManyRequest) {
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
        clearTimeout(useRoleStoreFindManyTimeout);
        useRoleStoreFindManyTimeout = setTimeout(async () => {
            setLoading(true);
            setError(undefined);
            try {
                setFindManyResponse(await Store.FindMany(findManyRequest));
            } catch (e) {
                console.error(`error finding roles: ${e.message ? e.message : e.toString()}`);
                setError(`error finding roles: ${e.message ? e.message : e.toString()}`);
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
