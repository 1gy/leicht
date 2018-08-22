import * as http from 'http';
import { Readable } from 'stream';

export type ServerRequest = http.IncomingMessage;
export type ServerResponse = http.ServerResponse;
export type RequestHandler = (req: ServerRequest, res: ServerResponse) => Promise<ResponseObject>;

export type Middleware = (handler: RequestHandler) => RequestHandler;

export const serve = (handler: RequestHandler): http.Server => {
    return http.createServer((req, res) => {
        handler(req, res).then(value => {
            if (value == null) {
                send(res, 204, null);
            } else {
                send(res, res.statusCode, value);
            }
        });
    });
};

export type ResponseObject = string | object | Buffer | Readable | null | undefined;

export const send = (res: ServerResponse, code: number, obj: ResponseObject): void => {
    res.statusCode = code;

    // empty
    if (obj === null || obj === undefined) {
        res.end();
        return;
    }

    // buffer
    if (obj instanceof Buffer) {
        if (!res.hasHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/octet-stream');
        }
        res.setHeader('Content-Length', obj.length);
        res.end(obj);
        return;
    }

    // stream
    if (obj instanceof Readable) {
        if (!res.hasHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/octet-stream');
        }
        obj.pipe(res);
        return;
    }

    // string
    if (typeof obj === 'string') {
        if (!res.hasHeader('Content-Type')) {
            res.setHeader('Content-Type', 'text/plain');
        }
        const responseText = obj;
        res.setHeader('Content-Length', Buffer.byteLength(responseText));
        res.end(responseText);
        return;
    }

    // object
    if (typeof obj === 'object') {
        if (!res.hasHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
        }

        const responseText = JSON.stringify(obj);
        res.setHeader('Content-Length', Buffer.byteLength(responseText));
        res.end(responseText);
    }
};
