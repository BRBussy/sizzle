import {IDIdentifierType} from './types';

interface IDIdentifier {
    type: string;
    id: string;
}

function IDIdentifier(id: string): IDIdentifier {
    return {
        type: IDIdentifierType,
        id
    };
}

export default IDIdentifier;
