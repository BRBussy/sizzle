import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';

interface GetBudgetForDateRangeRequest {
    startDate: string;
    endDate: string;
}

interface GetBudgetForDateRangeResponse {

}

const Admin = {
    serviceProvider: 'Budget-Admin',
    async GetBudgetForDateRange(request: GetBudgetForDateRangeRequest): Promise<GetBudgetForDateRangeResponse> {
        const response =  await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Admin.serviceProvider}.GetBudgetForDateRange`,
            request
        });
        return {

        };
    }
};

export default Admin;
