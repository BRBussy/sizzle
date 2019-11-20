import ContactFailedError from './ContactFailedError';
import MethodFailedError from './MethodFailedError';

interface JSONRPCRequestProps {
    url: string;
    method: string;
    request: any;
    verbose?: boolean;
}

export default async function jsonRPCRequest({url, method, request, verbose}: JSONRPCRequestProps) {
    const header = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    });

    const body = {
        jsonrpc: '2.0',
        method,
        params: [request],
        id: 1234
    };
    console.debug(`API Request: ${body.method} -->\n`, body.params[0]);
    if (verbose) {
        try {
            console.debug('\n', JSON.parse(JSON.stringify(body.params[0])));
            console.debug('\n', JSON.stringify(body.params[0]));
        } catch (e) {
            console.error('error parsing stringified body.params[0]');
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
