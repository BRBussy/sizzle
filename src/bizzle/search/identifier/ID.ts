interface IDIdentifier {
    type: string;
    id: string;
}

function IDIdentifier(id: string): IDIdentifier {
    return {
        type: 'id',
        id
    };
}

export default IDIdentifier;
