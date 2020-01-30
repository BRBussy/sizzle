import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';
import {BudgetEntry} from '.';

export interface XLSXStandardBankStatementToBudgetEntriesRequest {
    xlsxStatement: string;
}

export interface XLSXStandardBankStatementToBudgetEntriesResponse {
    budgetEntries: BudgetEntry[];
}

export interface DuplicateCheckRequest {
    budgetEntries: BudgetEntry[];
}

export interface DuplicateCheckResponse {
    uniques: BudgetEntry[];
    exactDuplicates: BudgetEntry[];
    suspectedDuplicates: BudgetEntry[];
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
    },
    async DuplicateCheck(request: DuplicateCheckRequest): Promise<DuplicateCheckResponse> {
        const response = await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Admin.serviceProvider}.DuplicateCheck`,
            request
        });
        return {
            uniques: response.uniques.map((be: BudgetEntry) => (new BudgetEntry(be))),
            exactDuplicates: response.exactDuplicates.map((be: BudgetEntry) => (new BudgetEntry(be))),
            suspectedDuplicates: response.suspectedDuplicates.map((be: BudgetEntry) => (new BudgetEntry(be)))
        };
    }
};

export default Admin;
