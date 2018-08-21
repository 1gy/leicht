import { serve } from '../src/serve';
import fetch from 'node-fetch';

describe('serve', () => {
    it('no error', async () => {
        const server = serve(async (req, res) => {
            return `Hello, ${req.url}`;
        });
        server.listen(1234);
        server.close();
    });

    it('hello', async () => {
        const server = serve(async (req, res) => {
            return `Hello, ${req.url}`;
        });
        server.listen(1234);

        const response = await fetch('http://localhost:1234/hello');
        const body = await response.text();
        expect(body).toBe('Hello, /hello');

        server.close();
    });
});
