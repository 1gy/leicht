import { RequestHandler, Middleware } from './serve';

/**
 * create route middleware
 *
 * @param method GET/POST/PUT/DELETE
 */
const createRouteMiddleware = (method: string) => {
    /**
     * create route
     *
     * @param path
     */
    const createRoute = (path: string) => {
        /**
         * route middleware
         *
         * @param handler
         */
        const routeMiddleware: Middleware = handler => {
            /**
             * route handler
             *
             * @param req request
             * @param res response
             */
            const routeHandler: RequestHandler = async (req, res) => {
                if (method === req.method && req.url === path) {
                    // TODO: support url pattern
                    return await handler(req, res);
                }
                return null;
            };
            return routeHandler;
        };
        return routeMiddleware;
    };
    return createRoute;
};

export const get = createRouteMiddleware('GET');
export const post = createRouteMiddleware('POST');
export const put = createRouteMiddleware('PUT');
export const del = createRouteMiddleware('DELETE');

/**
 * find route
 *
 * @param routes
 */
export const router = (routes: RequestHandler[]) => {
    const routerMiddleware: Middleware = handler => {
        return async (req, res) => {
            for (const route of routes) {
                const result = await route(req, res);
                if (result != null) {
                    return result;
                }
            }
            return await handler(req, res);
        };
    };
    return routerMiddleware;
};

/**
 * create namespace
 *
 * @param namespace
 */
export const createNamespace = (namespace: string) => {
    const namespaceMiddleware: Middleware = handler => {
        return async (req, res) => {
            if (req.url && req.url.startsWith(namespace)) {
                req.url = req.url.slice(namespace.length);
                return await handler(req, res);
            }
            return null;
        };
    };
    return namespaceMiddleware;
};
