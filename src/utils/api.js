// This is a centralized API communication system that handles all HTTP requests to your backend. It automatically manages authentication tokens, headers, error handling, and session management.

import { API_BASE_URL, getToken, clearAuth } from "./auth";

const buildUrl = (endpoint) => {
  // Builds complete URLs for API requests & Handles both internal and external URLs
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

const handle401 = () => {
  clearAuth(); //Clears all authentication data & Notifies app about session expiry
  if (!window.location.pathname.includes("/login")) {
    window.dispatchEvent(new CustomEvent("auth:session-expired"));
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== "/login") {
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  //This is the main function that handles every API request.
  const url = buildUrl(endpoint);
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    // ✅ Auto-adds Bearer token if it exists
    // ✅ Merges custom headers from options
    // Bearer token is like a digital ID card that proves who you are to the server.
    // You: "I want to see my account"
    // Bank: "Show me your ID"  (You show your token)
    // Bank: "✅ Verified! Here's your account"
    // When you login, the server gives you a token (like a key). Every time you make a request, you show this key to prove you're logged in.
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

    // ✅ For objects → JSON

    // ✅ For FormData → No Content-Type (browser handles it)
    // ✅ For strings → No Content-Type
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

    // ✅ Handles both JSON and non-JSON responses
    // ✅ Gracefully handles empty responses
    // ✅ Returns raw text if JSON parsing fails

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
