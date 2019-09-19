import {NameIdentifierType} from './types';

interface NameIdentifier {
    type: string;
    name: string;
}

function NameIdentifier(name: string): NameIdentifier {
    return {
        type: NameIdentifierType,
        name
    };
}

export default NameIdentifier;
