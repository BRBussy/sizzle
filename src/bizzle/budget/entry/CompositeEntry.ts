import Entry from './Entry';
import {BudgetEntryCategoryRule} from 'bizzle/budget/entry/categoryRule';

export default class CompositeEntry extends Entry {
    categoryRule: BudgetEntryCategoryRule = new BudgetEntryCategoryRule();
    constructor(entry?: Entry) {
        super(entry);
        if (!entry) {
            return;
        }
    }
}
