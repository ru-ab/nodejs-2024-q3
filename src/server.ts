import { type IRegisterController } from './controllers/registerController';
import { IRoomController } from './controllers/roomController';
import { MessageServer } from './messageServer';
import { RequestTypes } from './types/message.types';
import { Session } from './types/session.types';

export class Server {
  constructor(
    registerController: IRegisterController,
    roomController: IRoomController
  ) {
    const router = new MessageServer<RequestTypes, Session>();

    router.use('reg', registerController.register);
    router.use('create_room', roomController.createRoom);
  }
}
