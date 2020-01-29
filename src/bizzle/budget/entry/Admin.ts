import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';
import {BudgetEntry} from '.';

export interface XLSXStandardBankStatementToBudgetEntriesRequest {
    xlsxStatement: string;
}

export interface XLSXStandardBankStatementToBudgetEntriesResponse {
    budgetEntries: BudgetEntry[];
}

const Admin = {
    serviceProvider: 'BudgetEntry-Admin',
    async XLSXStandardBankStatementToBudgetEntries(request: XLSXStandardBankStatementToBudgetEntriesRequest): Promise<XLSXStandardBankStatementToBudgetEntriesResponse> {
        const response = await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Admin.serviceProvider}.XLSXStandardBankStatementToBudgetEntries`,
            request
        });
        return {budgetEntries: response.budgetEntries.map((be: BudgetEntry) => (new BudgetEntry(be)))};
    }
};

export default Admin;
