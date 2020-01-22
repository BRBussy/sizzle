import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';

interface XLSXStandardBankStatementToXLSXBudgetRequest {
    xlsxStatement: string;
}

export interface XLSXStandardBankStatementToXLSXBudgetResponse {
    xlsxBudgets: { [key: string]: { [key: string]: Uint8Array } };
}

const Admin = {
    serviceProvider: 'Budget-Admin',
    async XLSXStandardBankStatementToXLSXBudget(request: XLSXStandardBankStatementToXLSXBudgetRequest): Promise<XLSXStandardBankStatementToXLSXBudgetResponse> {
        return await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Admin.serviceProvider}.XLSXStandardBankStatementToXLSXBudget`,
            request
        });
    }
};

export default Admin;
