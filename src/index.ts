import { DEFAULTS, type ClientOptions, CreateClient } from './client';
import Networking, { type ApiResponse } from './plugins/Networking';

class ReactNativeNetworkInterceptor {
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

  onApiResponse = (response: ApiResponse) => {
    this.client?.send(JSON.stringify(response));
  };

  useReactNativeNetwork(): ReactNativeNetworkInterceptor {
    Networking(this.onApiResponse);
    return this;
  }
}

const ReactNativeNetworkInterceptorInstance =
  new ReactNativeNetworkInterceptor().useReactNativeNetwork();

export default ReactNativeNetworkInterceptorInstance;
