import merge from 'merge';
import getHost from 'rn-host-detect';
import SocketManager from './socket-manager';

export interface ClientOptions {
  host: string;
  port: number;
}

export const DEFAULTS = {
  host: getHost('localhost'),
  port: 5001,
};

export class CreateClient {
  private options: ClientOptions;
  private socket: SocketManager;

  constructor(options: ClientOptions) {
    this.options = merge(options, DEFAULTS);
    const { host, port } = this.options;
    this.socket = new SocketManager(`ws://${host}:${port}`);
  }

  send(data: any) {
    this.socket.send(data);
  }

  onMessage(callback: (event: WebSocketMessageEvent) => void) {
    this.socket.on('message', callback);
  }

  closeSocket() {
    this.socket.close();
  }
}
