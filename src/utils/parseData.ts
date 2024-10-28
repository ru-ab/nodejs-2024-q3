import { Message } from '../messageServer';

export function parseData<T>(data: string): Message<T> {
  let message: Message<T> = JSON.parse(data);
  message = {
    ...message,
    data: !!message.data ? JSON.parse(message.data as string) : '',
  };
  return message;
}
