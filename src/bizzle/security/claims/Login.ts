import {parse} from './parse';
import {ClaimsType} from './types';

export default class Login {

    public static newFromJWT(jwt: string): Login {
        const loginClaimsPOJO = parse(jwt);
        if (loginClaimsPOJO.type as ClaimsType !== ClaimsType.LoginClaimsType) {
            throw new TypeError('claims not of type Login');
        }
        return new Login(loginClaimsPOJO as Login);
    }

    public userID: string = '';
    public expirationTime: number = 0;

    constructor(login?: Login) {
        if (!login) {
            return;
        }
        this.userID = login.userID;
        this.expirationTime = login.expirationTime;
    }
}
