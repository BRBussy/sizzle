import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';
import CategoryRule from './CategoryRule';

export interface CreateOneRequest {
    categoryRule: CategoryRule;
}

export interface CreateOneResponse {
    categoryRule: CategoryRule;
}

export interface UpdateOneRequest {
    categoryRule: CategoryRule;
}

export interface UpdateOneResponse {
    categoryRule: CategoryRule;
}

const Admin = {
    serviceProvider: 'BudgetEntryCategoryRule-Admin',
    async CreateOne(request: CreateOneRequest): Promise<CreateOneResponse> {
        const response = await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Admin.serviceProvider}.CreateOne`,
            request
        });
        return {
            categoryRule: new CategoryRule(response.categoryRule)
        };
    },
    async UpdateOne(request: UpdateOneRequest): Promise<UpdateOneResponse> {
        const response = await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Admin.serviceProvider}.UpdateOne`,
            request
        });
        return {
            categoryRule: new CategoryRule(response.categoryRule)
        };
    }
};

export default Admin;
