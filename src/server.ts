import { type IUserController } from './controllers/userController';
import { IRoomController } from './controllers/roomController';
import { MessageServer } from './messageServer';
import { RequestTypes } from './types/message.types';
import { Session } from './types/session.types';
import { IGameController } from './controllers/gameController';

export class Server {
  constructor(
    userController: IUserController,
    roomController: IRoomController,
    gameController: IGameController
  ) {
    const router = new MessageServer<RequestTypes, Session>();

    router.use('reg', userController.register);

    router.use('create_room', roomController.createRoom);
    router.use('add_user_to_room', roomController.addUserToRoom);

    router.use('add_ships', gameController.addShips);
    router.use('attack', gameController.attack);
  }
}
