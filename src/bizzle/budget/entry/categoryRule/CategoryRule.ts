export default class CategoryRule {
    public id: string = '';
    public ownerID: string = '';
    public categoryIdentifiers: string[] = [];
    public name: string = '';
    public strict: boolean = false;
    public expectedAmount: number = 0;
    public expectedAmountPeriod: number = 0;

    constructor(categoryRule?: CategoryRule) {
        if (!categoryRule) {
            return;
        }
        this.id = categoryRule.id;
        this.ownerID = categoryRule.ownerID;
        this.categoryIdentifiers = [...categoryRule.categoryIdentifiers];
        this.name = categoryRule.name;
        this.strict = categoryRule.strict;
        this.expectedAmount = categoryRule.expectedAmount;
        this.expectedAmountPeriod = categoryRule.expectedAmountPeriod;
    }
}