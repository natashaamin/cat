// To use this Helper
// import * as http from './src/api/HttpHelper';
import { API_HOST, API_KEY } from "../env";

interface HttpResponse<T> extends Response {
  ReadableStream?: T;
}

export function isTimeout(error: Error) {
  return (
    error.message === "Request timeout" ||
    error.message === "Network request failed"
  );
}

const TIMEOUT_DURATION = 30000; // timeout value in milliseconds

function buildApi(path: string) {
  return API_HOST + path;
}

async function buildHeaders(
  isProtected: boolean = true,
  customHeaders?: object
) {
  const httpHeaders = {
    "Content-Type": "application/json",
    "x-api-key": `${API_KEY}`,
  };

  // If path is in list of open (preauthorized) APIs, use API_TOKEN. Else use login session token
  return { ...httpHeaders, ...customHeaders };
}

async function http<T>(
  request: RequestInfo,
  init: RequestInit
): Promise<HttpResponse<T>> {
  console.log("Request", request, init);
  let response: HttpResponse<T>;
  try {
    // Check for request timeout
    response = await Promise.race([
      fetch(request, init),
      new Promise<never>((_, reject) =>
        setTimeout(() => {
          reject(new Error("Request timeout"));
        }, TIMEOUT_DURATION)
      ),
    ]);

    console.log("Response: ", response);
    // Skip checking for response body for PUT/DELETE
    switch (init.method) {
      case "put":
        break;
      case "delete":
        break;
      default:
        try {
          response = response;
          console.log("Response", response);
        } catch (e) {
          throw new Error();
        }
    }
  } catch (e) {
    throw e; // rethrow other unexpected errors
  }

  return response;
}

// GET Method
export async function get<T>(
  path: string,
  isProtected?: boolean,
  headers?: object
): Promise<HttpResponse<T>> {
  let apiHeaders;
  try {
    apiHeaders = new Headers(await buildHeaders(isProtected, headers));
  } catch (e) {
    throw new Error();
  }

  const args: RequestInit = {
    method: "get",
    headers: apiHeaders,
  };
  return await http<T>(buildApi(path), args);
}

// POST Method
export async function post<T>(
  path: string,
  body: any,
  isProtected?: boolean,
  headers?: object
): Promise<HttpResponse<T>> {
  let apiHeaders;
  try {
    apiHeaders = new Headers(await buildHeaders(isProtected, headers));
  } catch (e) {
    throw new Error();
  }

  const args: RequestInit = {
    method: "post",
    body: JSON.stringify(body),
    headers: apiHeaders,
  };
  return await http<T>(buildApi(path), args);
}

// PUT Method
export async function put(
  path: string,
  body: any,
  isProtected?: boolean,
  headers?: object
): Promise<HttpResponse<never>> {
  let apiHeaders;
  try {
    apiHeaders = new Headers(await buildHeaders(isProtected, headers));
  } catch (e) {
    throw new Error();
  }

  const args: RequestInit = {
    method: "put",
    body: JSON.stringify(body),
    headers: apiHeaders,
  };
  return await http<never>(buildApi(path), args);
}

// DELETE method
export async function del(
  path: string,
  isProtected?: boolean,
  headers?: object
): Promise<HttpResponse<never>> {
  let apiHeaders;
  try {
    apiHeaders = new Headers(await buildHeaders(isProtected, headers));
  } catch (e) {
    throw new Error();
  }

  const args: RequestInit = {
    method: "delete",
    headers: apiHeaders,
  };
  return await http<never>(buildApi(path), args);
}
