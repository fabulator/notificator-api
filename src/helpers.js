import { API_SECRET } from './config';

export function routeWrap(fn) {
    return (a, b, c) => {
        return fn(a, b).catch(c);
    };
}

export function privateWrap(fn) {
    return (a, b, c) => {
        if (a.body.token !== API_SECRET) {
            b.status(403).json({});
            return () => {};
        }

        return fn(a, b).catch(c);
    };
}
