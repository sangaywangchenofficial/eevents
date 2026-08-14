import { API_BASE_URL, getToken, clearAuth } from "./auth";

const buildUrl = (endpoint) => {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

const handle401 = () => {
  clearAuth();
  if (!window.location.pathname.includes("/login")) {
    window.dispatchEvent(new CustomEvent("auth:session-expired"));
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== "/login") {
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = buildUrl(endpoint);
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (
    !(options.body instanceof FormData) &&
    options.body &&
    typeof options.body !== "string" &&
    !options.skipJsonContentType
  ) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    ...options,
    headers,
    body:
      options.body instanceof FormData || options.skipJsonContentType
        ? options.body
        : options.body && typeof options.body !== "string"
          ? JSON.stringify(options.body)
          : options.body,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      handle401();
      const data = await response
        .json()
        .catch(() => ({ detail: "Session expired" }));
      throw { status: 401, ...data, __unauthorized: true };
    }

    let data;
    const text = await response.text();
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text, raw: text };
    }

    if (!response.ok) {
      throw { status: response.status, ...data, response };
    }

    return { data, status: response.status, ok: true };
  } catch (error) {
    if (error && error.__unauthorized) {
      throw error;
    }
    if (error && error.status === 401) {
      handle401();
    }
    throw error;
  }
};

export const api = {
  get: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options = {}) =>
    apiRequest(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options = {}) =>
    apiRequest(endpoint, { ...options, method: "PUT", body }),
  patch: (endpoint, body, options = {}) =>
    apiRequest(endpoint, { ...options, method: "PATCH", body }),
  delete: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: "DELETE" }),
};
