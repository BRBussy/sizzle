export default class User {
    public id: string = '';
    public ownerID: string = '';
    public name: string = '';
    public email: string = '';
    public roleIDs: string[] = [];
    public registered: boolean = false;

    constructor(user?: User) {
        if (!user) {
            return;
        }
        this.id = user.id;
        this.ownerID = user.ownerID;
        this.name = user.name;
        this.email = user.email;
        this.roleIDs = [...user.roleIDs];
        this.registered = user.registered;
    }
}