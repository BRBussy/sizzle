import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';
import BudgetConfig from './Config';

export interface GetMyConfigRequest {
    month: number;
}

export interface GetMyConfigResponse {
    config: BudgetConfig;
}

const Admin = {
    serviceProvider: 'BudgetConfig-Admin',
    async GetMyConfig(request: GetMyConfigRequest): Promise<GetMyConfigResponse> {
        const response = await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Admin.serviceProvider}.GetMyConfig`,
            request
        });
        return {budget: new BudgetConfig(response.budget)}
    },
};

export default Admin;
