import { httpServer } from './http_server/index.js';
import { Router } from './router.js';
import { HandlerDataTypes, RegisterMessage } from './types/message.types.js';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const server = new Router<HandlerDataTypes>();
server.use('reg', (data: RegisterMessage) => {
  console.log(data);
});
