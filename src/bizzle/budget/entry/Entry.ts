import moment from 'moment';

export default class Entry {
    public id: string = '';
    public ownerID: string = '';
    public date: string = moment().format();
    public description: string = '';
    public amount: number = 0;
    public categoryRuleID: string = '';

    constructor(entry?: Entry) {
        if (!entry) {
            return;
        }
        this.id = entry.id;
        this.ownerID = entry.ownerID;
        this.date = entry.date;
        this.description = entry.description;
        this.amount = entry.amount;
        this.categoryRuleID = entry.categoryRuleID;
    }
}
