import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';
import {User} from '.';
import Identifier from 'bizzle/search/identifier/Identifier';

export interface CreateOneRequest {
    user: User;
}

// tslint:disable-next-line:no-empty-interface
export interface CreateOneResponse {
}

export interface RegisterOneRequest {
    userIdentifier: Identifier;
    password: string;
}


// tslint:disable-next-line:no-empty-interface
export interface RegisterOneResponse {

}

export interface ChangePasswordRequest {
    userIdentifier: Identifier;
    password: string;
}

// tslint:disable-next-line:no-empty-interface
export interface ChangePasswordResponse {

}

const Admin = {
    serviceProvider: 'User-Admin',
    async CreateOne(request: CreateOneRequest): Promise<CreateOneResponse> {
        return await jsonRPCRequest({
            url: config.get('userURL'),
            method: `${Admin.serviceProvider}.CreateOne`,
            request
        });
    },
    async RegisterOne(request: RegisterOneRequest): Promise<RegisterOneResponse> {
        return await jsonRPCRequest({
            url: config.get('userURL'),
            method: `${Admin.serviceProvider}.RegisterOne`,
            request
        });
    },
    async ChangePassword(request: ChangePasswordRequest): Promise<ChangePasswordResponse> {
        return await jsonRPCRequest({
            url: config.get('userURL'),
            method: `${Admin.serviceProvider}.ChangePassword`,
            request
        });
    }
};

export default Admin;