import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    jwt: string;
}

const Authenticator = {
    serviceProvider: 'Authenticator',
    async Login(request: LoginRequest): Promise<LoginResponse> {
        return await jsonRPCRequest({
            url: config.get('authURL'),
            method: `${Authenticator.serviceProvider}.Login`,
            request
        });
    }
};

export default Authenticator;
