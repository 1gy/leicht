import { Middleware } from './serve';

export const compose = (...middlewares: Middleware[]): Middleware => {
    if (middlewares.length === 0) {
        return args => args;
    }
    if (middlewares.length === 1) {
        return middlewares[0];
    }

    return middlewares.reduce((a, b) => (...args) => a(b(...args)));
};
