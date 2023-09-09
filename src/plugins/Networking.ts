// @ts-nocheck
import XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor';

import queryString from 'query-string';

type ResponseType = '' | 'arraybuffer' | 'blob' | 'document' | 'json' | 'text';
type Response = string | Object | null;

export default (apiResponse: any) => {
  function onResponse(
    status: number,
    _: number,
    response: Response,
    responseURL: string,
    responseType: ResponseType,
    xhr: any
  ) {
    let params = null;
    const queryParamIdx = responseURL ? responseURL.indexOf('?') : -1;

    if (queryParamIdx > -1) {
      params = queryString.parse(responseURL.substr(queryParamIdx));
    }

    // assemble the request object
    const tronRequest = {
      responseURL: responseURL,
      method: xhr._method || null,
      headers: xhr._headers || null,
      params,
    };

    const sendResponse = (responseBodyText: any) => {
      let body: Response = `~~~ skipped ~~~`;
      if (responseBodyText) {
        try {
          // all i am saying, is give JSON a chance...
          body = JSON.parse(responseBodyText);
        } catch (error) {
          body = response;
        }
      }
      const tronResponse = {
        body,
        status,
        headers: xhr.responseHeaders || null,
      };

      apiResponse?.({ tronRequest, tronResponse });
    };

    // can we use the real response?
    const useRealResponse =
      typeof response === 'string' || typeof response === 'object';

    // prepare the right body to send
    if (useRealResponse) {
      if (
        responseType === 'blob' &&
        typeof FileReader !== 'undefined' &&
        response
      ) {
        // Disable reason: FileReader should be in global scope since RN 0.54

        const bReader = new FileReader();
        const brListener = () => {
          sendResponse(bReader.result);
          bReader.removeEventListener('loadend', brListener);
        };
        bReader.addEventListener('loadend', brListener);
        bReader.readAsText(response as Blob);
      } else {
        sendResponse(response);
      }
    } else {
      sendResponse('');
    }
  }

  XHRInterceptor.setResponseCallback(onResponse);
  XHRInterceptor.enableInterception();
};
