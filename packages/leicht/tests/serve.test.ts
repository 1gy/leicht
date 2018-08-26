import fetch from 'node-fetch';
import { AddressInfo } from 'net';
import { serve } from '../src/serve';

describe('serve', () => {
    it('no error', async () => {
        const server = serve(async (req, res) => {
            return `Hello, ${req.url}`;
        });

        try {
            server.listen();
        } finally {
            server.close();
        }
    });

    it('hello', async () => {
        const server = serve(async (req, res) => {
            return `Hello, ${req.url}`;
        });

        try {
            server.listen();
            const address = <AddressInfo>server.address();

            const response = await fetch(`http://localhost:${address.port}/hello`);
            const body = await response.text();
            expect(body).toBe('Hello, /hello');
        } finally {
            server.close();
        }
    });
});
