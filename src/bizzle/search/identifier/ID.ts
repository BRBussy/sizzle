import {IdentifierType} from '.';

export default interface IDIdentifier {
    type: IdentifierType;
    id: string;
}

export function IDIdentifier(id: string): IDIdentifier {
    return {
        type: IdentifierType.IDIdentifierType,
        id
    };
}
