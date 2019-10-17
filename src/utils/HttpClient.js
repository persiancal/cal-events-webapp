async function Request(method, url, body = undefined, headers = undefined) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  try {
    const response = await fetch(url, {
      method,
      headers: headers || defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
    const responseBody = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      data: responseBody,
    };
  } catch (e) {
    return {
      ok: false,
      status: e.status,
      data: e,
    };
  }
}

['get', 'put', 'post', 'patch', 'delete'].forEach((method) => {
  Request[method] = function req(...args) {
    return Request(method.toUpperCase(), ...args);
  };
});

export default Request;
