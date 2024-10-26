import { type IRegisterController } from './controllers/registerController';
import { MessageServer } from './messageServer';
import { RequestTypes } from './types/message.types';

export class Server {
  constructor(registerController: IRegisterController) {
    const router = new MessageServer<RequestTypes>();

    router.use('reg', registerController.register);
  }
}
