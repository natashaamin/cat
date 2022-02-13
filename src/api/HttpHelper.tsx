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

    if (!response.ok) {
      const error = await response.json();
      console.log('Error response', error);
      throw { status: response.status, body: error };
    }

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