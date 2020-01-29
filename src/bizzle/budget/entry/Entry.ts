export default class Entry {
    public date: number = 0;
    public description: string = '';
    public amount: number = 0;
    public category: string = '';
    public identifier: string = '';

    constructor(entry?: Entry) {
        if (!entry) {
            return;
        }
        this.date = entry.date;
        this.description = entry.description;
        this.amount = entry.amount;
        this.category = entry.category;
        this.identifier = entry.identifier;
    }
}
