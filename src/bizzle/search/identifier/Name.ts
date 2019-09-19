import {NameIdentifierType} from './types';

interface NameIdentifier {
    type: string;
    id: string;
}

function NameIdentifier(id: string): NameIdentifier {
    return {
        type: NameIdentifierType,
        id
    };
}

export default NameIdentifier;
