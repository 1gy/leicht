# leicht

lightweight http server

-   simple
-   asynchronous
-   type safe

## Examples

hello world

```js
const server = serve(async (req, res) => {
    return `Hello, ${req.url}`;
});
server.listen(1234);
```

middleware sample

```js
export const log: Middleware = handler => {
    return async (req, res) => {
        console.log(req.url);
        return await handler(req, res);
    };
};

const server = serve(
    log(async (req, res) => {
        return `Hello, ${req.url}`;
    })
);
server.listen(1234);
```
