import fetch from 'node-fetch';
import { AddressInfo } from 'net';
import { serve, RequestHandler } from '../src/serve';
import { router, get, post, createNamespace } from '../src/router';

describe('router', () => {
    it('no error', async () => {
        const path1 = get('/path1')(async (req, res) => {
            return 'get path1';
        });
        const path2 = post('/path2')(async (req, res) => {
            return 'post path2';
        });
        const notFound: RequestHandler = async (req, res) => {
            return 'not found';
        };
        const route = router([path1, path2]);
        const server = serve(route(notFound));

        try {
            server.listen();
        } finally {
            server.close();
        }
    });

    it('simple routing', async () => {
        const path1 = get('/path1')(async (req, res) => {
            return 'get path1';
        });
        const path2 = post('/path2')(async (req, res) => {
            return 'post path2';
        });
        const notFound: RequestHandler = async (req, res) => {
            return 'not found';
        };
        const route = router([path1, path2]);
        const server = serve(route(notFound));

        try {
            server.listen();
            const address = <AddressInfo>server.address();

            // GET /path1
            const response1 = await (await fetch(`http://localhost:${address.port}/path1`)).text();
            expect(response1).toBe('get path1');

            // POST /path2
            const response2 = await (await fetch(`http://localhost:${address.port}/path2`, { method: 'POST' })).text();
            expect(response2).toBe('post path2');

            // POST /path1
            const response3 = await (await fetch(`http://localhost:${address.port}/path1`, { method: 'POST' })).text();
            expect(response3).toBe('not found');

            // POST /not_found
            const response4 = await (await fetch(`http://localhost:${address.port}/not_found`)).text();
            expect(response4).toBe('not found');
        } finally {
            server.close();
        }
    });

    it('namespace', async () => {
        const path1 = get('/path1')(async (req, res) => {
            return 'get path1';
        });
        const path2 = post('/path2')(async (req, res) => {
            return 'post path2';
        });
        const nestNotFound: RequestHandler = async (req, res) => {
            return 'nest not found';
        };
        const notFound: RequestHandler = async (req, res) => {
            return 'not found';
        };

        const route = router([path1, path2]);
        const nestedRoute = createNamespace('/nest')(route(nestNotFound));
        const server = serve(router([nestedRoute])(notFound));

        try {
            server.listen();
            const address = <AddressInfo>server.address();

            // GET /path1
            const response1 = await (await fetch(`http://localhost:${address.port}/path1`)).text();
            expect(response1).toBe('not found');

            // POST /path2
            const response2 = await (await fetch(`http://localhost:${address.port}/path2`, { method: 'POST' })).text();
            expect(response2).toBe('not found');

            // GET /nest/path1
            const response4 = await (await fetch(`http://localhost:${address.port}/nest/path1`)).text();
            expect(response4).toBe('get path1');

            // POST /nest/path2
            const response5 = await (await fetch(`http://localhost:${address.port}/nest/path2`, {
                method: 'POST'
            })).text();
            expect(response5).toBe('post path2');

            // GET /nest/not_found
            const response6 = await (await fetch(`http://localhost:${address.port}/nest/not_found`)).text();
            expect(response6).toBe('nest not found');
        } finally {
            server.close();
        }
    });
});
