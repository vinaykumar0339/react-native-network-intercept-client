import { DEFAULTS, type ClientOptions, CreateClient } from './client';
import Networking from './plugins/Networking';

export class ReactNativeNetworkInterceptor {
  private options: ClientOptions = DEFAULTS;
  private client?: CreateClient;

  configure(options: ClientOptions) {
    const newOptions = Object.assign({}, this.options, options);
    this.options = newOptions;
  }

  connect() {
    const client = new CreateClient(this.options);
    // assigning the client;
    this.client = client;

    const onMessage = (event: WebSocketMessageEvent) => {
      console.log(event.data, 'event.data');
    };

    this.client.onMessage(onMessage);
  }

  onApiResponse(response: any) {
    this.client?.send(response);
  }

  useReactNativeNetwork(): ReactNativeNetworkInterceptor {
    Networking(this.onApiResponse);
    return this;
  }
}
