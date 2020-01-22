import Entry from './Entry';

export default class Budget {
    public month: string = '';
    public year: number = 0;
    public summary: { [key: string]: number } = {};
    public entries: { [key: string]: Entry[] } = {};

    constructor(budget?: Budget) {
        if (!budget) {
            return;
        }
        this.month = budget.month;
        this.year = budget.year;
        this.summary = {...budget.summary};
        Object.keys(budget.entries).forEach((key) => {
            this.entries[key] = budget.entries[key].map((e) => (new Entry(e)));
        });
    }
}
