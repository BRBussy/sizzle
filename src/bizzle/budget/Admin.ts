import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';
import Budget from './Budget';

interface XLSXStandardBankStatementToXLSXBudgetRequest {
    xlsxStatement: string;
}

export interface XLSXStandardBankStatementToXLSXBudgetResponse {
    xlsxBudgets: { [key: string]: { [key: string]: Uint8Array } };
}

export interface XLSXStandardBankStatementToBudgetsRequest {
    xlsxStatement: string;
}

export interface XLSXStandardBankStatementToBudgetsResponse {
    budgets: Budget[];
}

const Admin = {
    serviceProvider: 'Budget-Admin',
    async XLSXStandardBankStatementToXLSXBudget(request: XLSXStandardBankStatementToXLSXBudgetRequest): Promise<XLSXStandardBankStatementToXLSXBudgetResponse> {
        return await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Admin.serviceProvider}.XLSXStandardBankStatementToXLSXBudget`,
            request
        });
    },
    async XLSXStandardBankStatementToBudgets(request: XLSXStandardBankStatementToBudgetsRequest): Promise<XLSXStandardBankStatementToBudgetsResponse> {
        const response = await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Admin.serviceProvider}.XLSXStandardBankStatementToBudgets`,
            request
        });
        return {budgets: response.budgets.map((b: Budget) => (new Budget(b)))};
    }
};

export default Admin;
