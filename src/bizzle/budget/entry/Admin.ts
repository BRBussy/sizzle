import config from 'react-global-configuration';
import jsonRPCRequest from 'utilities/network/jsonRPCRequest';
import {BudgetEntry} from '.';

export interface XLSXStandardBankStatementToBudgetCompositeEntriesRequest {
    xlsxStatement: string;
}

export interface XLSXStandardBankStatementToBudgetCompositeEntriesResponse {
    budgetEntries: BudgetEntry[];
}

export interface DuplicateCheckRequest {
    budgetEntries: BudgetEntry[];
}

export interface DuplicateEntries {
    existing: BudgetEntry;
    new: BudgetEntry;
}

export interface DuplicateCheckResponse {
    uniques: BudgetEntry[];
    exactDuplicates: DuplicateEntries[];
    suspectedDuplicates: DuplicateEntries[];
}

export interface CreateManyRequest {
    budgetEntries: BudgetEntry[];
}

// tslint:disable-next-line:no-empty-interface
export interface CreateManyResponse {
}

export interface UpdateOneRequest {
    budgetEntry: BudgetEntry;
}

// tslint:disable-next-line:no-empty-interface
export interface UpdateOneResponse {

}

export interface UpdateManyRequest {
    budgetEntries: BudgetEntry[];
}

// tslint:disable-next-line:no-empty-interface
export interface UpdateManyResponse {

}

const Admin = {
    serviceProvider: 'BudgetEntry-Admin',
    async XLSXStandardBankStatementToBudgetEntries(request: XLSXStandardBankStatementToBudgetCompositeEntriesRequest): Promise<XLSXStandardBankStatementToBudgetCompositeEntriesResponse> {
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
            exactDuplicates: response.exactDuplicates.map((ed: DuplicateEntries) => ({
                existing: new BudgetEntry(ed.existing),
                new: new BudgetEntry(ed.new),
            })),
            suspectedDuplicates: response.suspectedDuplicates.map((sd: DuplicateEntries) => ({
                existing: new BudgetEntry(sd.existing),
                new: new BudgetEntry(sd.new),
            }))
        };
    },
    async CreateMany(request: CreateManyRequest): Promise<CreateManyResponse> {
        return await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Admin.serviceProvider}.CreateMany`,
            request
        });
    },
    async UpdateOne(request: UpdateOneRequest): Promise<UpdateOneResponse> {
        return await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Admin.serviceProvider}.UpdateOne`,
            request
        })
    },
    async UpdateMany(request: UpdateManyRequest): Promise<UpdateManyResponse> {
        return await jsonRPCRequest({
            url: config.get('budgetURL'),
            method: `${Admin.serviceProvider}.UpdateMany`,
            request
        })
    }
};

export default Admin;
