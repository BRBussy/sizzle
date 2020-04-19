export default class Role {
    public id: string = '';
    public name: string = '';
    public permissions: string[] = [];

    constructor(role?: Role) {
        if (!role) {
            return;
        }
        this.id = role.id;
        this.name = role.name;
        this.permissions = [...role.permissions];
    }
}