import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';
import BudgetConfig from './Config';

// tslint:disable-next-line:no-empty-interface
export interface GetMyConfigRequest {
}

export interface GetMyConfigResponse {
    budgetConfig: BudgetConfig;
}

export interface SetMyConfigRequest {
    budgetConfig: BudgetConfig;
}

// tslint:disable-next-line:no-empty-interface
export interface SetMyConfigResponse {
}

const Admin = {
    serviceProvider: 'BudgetConfig-Admin',
    async GetMyConfig(request: GetMyConfigRequest): Promise<GetMyConfigResponse> {
        const response = await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Admin.serviceProvider}.GetMyConfig`,
            request
        });
        return {budgetConfig: new BudgetConfig(response.budgetConfig)}
    },
    async SetMyConfig(request: SetMyConfigRequest): Promise<SetMyConfigResponse> {
        return await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Admin.serviceProvider}.SetMyConfig`,
            request
        });
    }
};

export default Admin;
