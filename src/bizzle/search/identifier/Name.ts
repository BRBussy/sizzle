import {IdentifierType} from '.';

export default interface NameIdentifier {
    type: IdentifierType;
    name: string;
}

export function NameIdentifier(name: string): NameIdentifier {
    return {
        type: IdentifierType.NameIdentifierType,
        name
    };
}
