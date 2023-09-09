const SOCKET_OPEN_STATE = 1;

type SocketManagerEventName = 'open' | 'close' | 'message';

interface SocketManagerEventCallback {
  open: () => void;
  close: (event: WebSocketCloseEvent) => void;
  message: (event: WebSocketMessageEvent) => void;
}

export default class SocketManager {
  private webSocket: WebSocket;
  constructor(path: string) {
    this.webSocket = new WebSocket(path);
  }

  send(payload: string | ArrayBuffer | ArrayBufferView | Blob) {
    if (this.webSocket.readyState === SOCKET_OPEN_STATE) {
      this.webSocket.send(payload);
    }
  }

  on<T extends SocketManagerEventName>(
    eventName: T,
    callback: SocketManagerEventCallback[T]
  ) {
    if (eventName === 'open') {
      this.webSocket.onopen = callback as SocketManagerEventCallback['open'];
    } else if (eventName === 'message') {
      this.webSocket.onmessage = callback;
    } else if (eventName === 'close') {
      this.webSocket.onclose = callback;
    }
  }

  close() {
    this.webSocket.close();
  }
}
