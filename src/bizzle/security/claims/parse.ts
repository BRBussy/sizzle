export function parse(jwt: string): { [key: string]: any } {
    const payloadData = jwt.substring(jwt.indexOf('.') + 1, jwt.lastIndexOf('.'));
    const payloadString = atob(payloadData);
    return JSON.parse(payloadString);
}
