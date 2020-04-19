export default class Config {
    public id: string = '';
    public ownerID: string = '';
    public otherCategoryRuleID: string = '';
    public summaryDatePeriodCategoryRuleID: string = '';

    constructor(config?: Config) {
        if (!config) {
            return;
        }
        this.id = config.id;
        this.ownerID = config.ownerID;
        this.otherCategoryRuleID = config.otherCategoryRuleID;
        this.summaryDatePeriodCategoryRuleID = config.summaryDatePeriodCategoryRuleID;
    }
}