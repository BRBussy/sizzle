import Entry from './entry/Entry';
import CategoryRule from './entry/categoryRule/CategoryRule';

export default class Budget {
    public startDate: string = '';
    public endDate: string = '';
    public summary: { [key: string]: CategoryTotal } = {};
    public entries: { [key: string]: Entry[] } = {};
    public totalIn: CompareTotal = new CompareTotal();
    public totalOut: CompareTotal = new CompareTotal();
    public net: number = 0;

    constructor(budget?: Budget) {
        if (!budget) {
            return;
        }
        this.startDate = budget.startDate;
        this.endDate = budget.endDate;
        this.summary = {...budget.summary};
        Object.keys(budget.summary).forEach((key) => {
            this.summary[key] = new CategoryTotal(budget.summary[key]);
        });
        Object.keys(budget.entries).forEach((key) => {
            this.entries[key] = budget.entries[key].map((e) => (new Entry(e)));
        });
        this.totalIn = new CompareTotal(budget.totalIn);
        this.totalOut = new CompareTotal(budget.totalOut);
        this.net = budget.net;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class CompareTotal {
    public expected: number = 0;
    public actual: number = 0;

    constructor(compareTotal?: CompareTotal) {
        if (!compareTotal) {
            return;
        }
        this.expected = compareTotal.expected;
        this.actual = compareTotal.actual;
    }

}

// tslint:disable-next-line:max-classes-per-file
export class CategoryTotal {
    public amount: number = 0;
    public budgetEntryCategoryRule: CategoryRule = new CategoryRule();

    constructor(categoryTotal?: CategoryTotal) {
        if (!categoryTotal) {
            return;
        }
        this.amount = categoryTotal.amount;
        this.budgetEntryCategoryRule = new CategoryRule(categoryTotal.budgetEntryCategoryRule);
    }
}
