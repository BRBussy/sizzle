import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';
import {BudgetEntry, BudgetCompositeEntry} from '.';

export interface XLSXStandardBankStatementToBudgetCompositeEntriesRequest {
    xlsxStatement: string;
}

export interface XLSXStandardBankStatementToBudgetCompositeEntriesResponse {
    budgetCompositeEntries: BudgetCompositeEntry[];
}

export interface DuplicateCheckRequest {
    budgetEntries: BudgetEntry[];
}

export interface DuplicateCheckResponse {
    uniques: BudgetEntry[];
    exactDuplicates: BudgetEntry[];
    suspectedDuplicates: BudgetEntry[];
}

export interface CreateManyRequest {
    budgetEntries: BudgetEntry[];
}

// tslint:disable-next-line:no-empty-interface
export interface CreateManyResponse {
}

const Admin = {
    serviceProvider: 'BudgetEntry-Admin',
    async XLSXStandardBankStatementToBudgetCompositeEntries(request: XLSXStandardBankStatementToBudgetCompositeEntriesRequest): Promise<XLSXStandardBankStatementToBudgetCompositeEntriesResponse> {
        const response = await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Admin.serviceProvider}.XLSXStandardBankStatementToBudgetCompositeEntries`,
            request
        });
        return {budgetCompositeEntries: response.budgetCompositeEntries.map((bce: BudgetCompositeEntry) => (new BudgetCompositeEntry(bce)))};
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
    },
    async CreateMany(request: CreateManyRequest): Promise<CreateManyResponse> {
        return await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Admin.serviceProvider}.CreateMany`,
            request
        });
    }
};

export default Admin;
