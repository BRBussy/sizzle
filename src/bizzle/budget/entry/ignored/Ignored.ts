export default class Ignored {
    public id: string = '';
    public ownerID: string = '';
    public description: string = '';

    constructor(ignored?: Ignored) {
        if (!ignored) {
            return;
        }
        this.id = ignored.id;
        this.ownerID = ignored.ownerID;
        this.description = ignored.description;
    }
}