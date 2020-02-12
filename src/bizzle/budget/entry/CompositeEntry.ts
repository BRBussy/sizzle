import Entry from './Entry';
import {BudgetCategoryRule} from 'bizzle/budget/entry/categoryRule';

export default class CompositeEntry extends Entry {
    categoryRule: BudgetCategoryRule = new BudgetCategoryRule();
    constructor(entry?: Entry) {
        super(entry);
        if (!entry) {
            return;
        }
    }
}
