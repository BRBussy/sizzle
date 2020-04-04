import Entry from './entry/Entry';

export default class Budget {
    public startDate: string = '';
    public endDate: string = '';
    public summary: { [key: string]: number } = {};
    public entries: { [key: string]: Entry[] } = {};
    public totalIn: {
        expected: number;
        actual: number;
    } = {
        expected: 0,
        actual: 0
    };
    public totalOut: {
        expected: number;
        actual: number;
    } = {
        expected: 0,
        actual: 0
    };
    public net: number = 0;

    constructor(budget?: Budget) {
        if (!budget) {
            return;
        }
        this.startDate = budget.startDate;
        this.endDate = budget.endDate;
        this.summary = {...budget.summary};
        Object.keys(budget.entries).forEach((key) => {
            this.entries[key] = budget.entries[key].map((e) => (new Entry(e)));
        });
        this.totalIn = {...budget.totalIn};
        this.totalOut = {...budget.totalOut};
        this.net = budget.net;
    }
}
