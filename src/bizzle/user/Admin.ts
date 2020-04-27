import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';
import {User} from '.';

export interface CreateOneRequest {
    user: User;
}

// tslint:disable-next-line:no-empty-interface
export interface CreateOneResponse {
}

const Admin = {
    serviceProvider: 'User-Admin',
    async CreateOne(request: CreateOneRequest): Promise<CreateOneResponse> {
        return await jsonRPCRequest({
            url: config.get('userURL'),
            method: `${Admin.serviceProvider}.CreateOne`,
            request
        });
    }
};

export default Admin;