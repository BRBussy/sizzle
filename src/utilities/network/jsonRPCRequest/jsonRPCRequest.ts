import ContactFailedError from './ContactFailedError';
import MethodFailedError from './MethodFailedError';

interface JSONRPCRequestProps {
    url: string;
    method: string;
    request: any;
    verbose?: boolean;
}

async function jsonRPCRequest({url, method, request, verbose}: JSONRPCRequestProps) {
    const header = new Headers({
        'Content-Type': 'application/json'
    });
    if (method !== 'Authenticator.Login') {
        const jwt = localStorage.getItem('jwt');
        if (!jwt || jwt === 'null' || jwt === '') {
            throw new Error('jwt not set');
        }
        header.append('Authorization', jwt);
    }

    const body = {
        jsonrpc: '2.0',
        method,
        params: request,
        id: 1234
    };
    console.debug(`API Request: ${body.method} -->\n`, body.params);
    if (verbose) {
        try {
            console.debug('\n', JSON.parse(JSON.stringify(body.params)));
            console.debug('\n', JSON.stringify(body.params));
        } catch (e) {
            console.error('error parsing stringified body.params');
        }
    }

    let responseObjectJson;
    try {
        const responseObject = await fetch(
            url,
            {
                method: 'POST',
                headers: header,
                mode: 'cors',
                body: JSON.stringify(body)
            }
        );
        responseObjectJson = await responseObject.json();
    } catch (e) {
        console.error(`API Failed: ${body.method} -->\n`, e);
        throw new ContactFailedError(e, body.method);
    }

    if (responseObjectJson.result) {
        console.debug(`API Response Success: ${body.method}-->\n`, responseObjectJson.result);
        return responseObjectJson.result;
    } else {
        console.error(`API Response Error: ${body.method}-->\n`, responseObjectJson.error);
        throw new MethodFailedError(responseObjectJson.error, body.method);
    }
}

export default jsonRPCRequest;