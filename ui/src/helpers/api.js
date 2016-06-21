const REQUEST_FAILED_ERROR = "Failed connection!";
const TIMEOUT_ERROR = "Connection doesn't respond!";

const GLOBAL_TIMEOUT = 5 * 1000; // 10 seconds
const PING_TIMEOUT = 5 * 1000; // 5 seconds

const MAX_SESSION_TIME = 16 * 60 * 60 * 1000;

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleRequest(request, noJSON) {
  try {
    // Race between the timeout
    let timeoutPromise = timeout(GLOBAL_TIMEOUT);
    let response = await Promise.race([timeoutPromise, request]);
    if (response instanceof Response) {
      // Network replied in time.
    } else {
      // Clear the server.
      SERVER = undefined;
      throw new Error(TIMEOUT_ERROR);
    }
    if (response.ok) {
      var result;
      if (noJSON) {
        result = await response.text();
      } else {
        result = await response.json();
      }
      return result;
    }
  } catch (err) {
    console.log("Error on API", err);
    if (err instanceof TypeError) {
      SERVER = undefined;
      // This will usually mean a network error.
      if (err.message == "Network request failed") {
        throw new Error(REQUEST_FAILED_ERROR);
      }
      throw err;
    }
    throw new Error("Eroare neașteptată: " + err.message);
  }
  let statusText = await response.text();
  throw new Error("Eroare neașteptată [" + response.status + "]: " + statusText);
}

export async function post(options) {
  return handleRequest(fetch(options.endpoint, {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(options.data),
  }), options.noJSON);
}

export async function get(options) {
  return handleRequest(fetch(options.endpoint, {
    method: 'get',
    headers: {'Content-Type': 'application/json'},
  }), options.noJSON);
}

export async function put(options) {
  return handleRequest(fetch(options.endpoint, {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(options.data),
  }), options.noJSON);
}
