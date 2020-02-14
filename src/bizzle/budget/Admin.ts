import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';
import Budget from './Budget';

interface GetBudgetForMonthInYearRequest {
    month: number;
}

interface GetBudgetForMonthInYearResponse {
    budget: Budget;
}

interface GetBudgetForDateRangeRequest {
    startDate: string;
    endDate: string;
}

interface GetBudgetForDateRangeResponse {
    budget: Budget;
}

const Admin = {
    serviceProvider: 'Budget-Admin',
    async GetBudgetForMonthInYear(request: GetBudgetForMonthInYearRequest): Promise<GetBudgetForMonthInYearResponse> {
        const response = await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Admin.serviceProvider}.GetBudgetForMonthInYear`,
            request
        });
        return {budget: new Budget(response.budget)}
    },
    async GetBudgetForDateRange(request: GetBudgetForDateRangeRequest): Promise<GetBudgetForDateRangeResponse> {
        const response = await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Admin.serviceProvider}.GetBudgetForDateRange`,
            request
        });
        return {budget: new Budget(response.budget)}
    }
};

export default Admin;
