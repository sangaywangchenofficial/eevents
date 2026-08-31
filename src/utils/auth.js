// ── API base URLs — driven by .env so no hardcodes anywhere in the codebase ──
// All /api/v1 endpoint requests
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

// Bare origin — used to build media/image src URLs (e.g. `${BACKEND_ORIGIN}${event.image}`)
export const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN ?? "http://localhost:8000";

/**
 * Build an absolute URL for a backend media/image path.
 * Usage: <img src={getMediaUrl(event.event_image)} />
 * Returns '' if path is falsy so <img> src is safe.
 */
export const getMediaUrl = (path) => (path ? `${BACKEND_ORIGIN}${path}` : "");

export {
  APP_NAME,
  APP_ENV,
  APP_URL,
  APP_NAME_UPPER,
  APP_NAME_CAPITALIZED,
  DEFAULT_SEO,
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildEventSchema,
  buildBreadcrumbSchema
} from "./config";

export const STORAGE_KEYS = {
  TOKEN: "authToken",
  USER: "authUser",
  USER_ID: "authUserId",
  EMAIL: "authEmail",
  USERNAME: "authUsername",
  REMEMBER_EMAIL: "rememberedEmail",
  REMEMBER_ME: "rememberMe",
  LOGIN_AT: "authLoginAt",  // Timestamp (ms) recorded at login — used for client-side expiry check
};

// ─── Session expiry duration ───────────────────────────────────────────────
// Read from the Vite env var so the value is never hardcoded.
// The fallback of 3 mirrors the backend SESSION_EXPIRATION_DAYS default.
const SESSION_EXPIRATION_DAYS = Number(
  import.meta.env.VITE_SESSION_EXPIRATION_DAYS ?? 3
);
const SESSION_EXPIRATION_MS = SESSION_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN) || "";
};

export const getUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getUserId = () => {
  return localStorage.getItem(STORAGE_KEYS.USER_ID) || "";
};

export const isAuthenticated = () => {
  const token = getToken();
  const userId = getUserId();
  const user = getUser();
  return !!(token && userId && user);
};

export const setAuth = ({ token, user, userId, username, email }) => {
  if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  if (userId) localStorage.setItem(STORAGE_KEYS.USER_ID, String(userId));
  if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  if (username) localStorage.setItem(STORAGE_KEYS.USERNAME, username);
  if (email) localStorage.setItem(STORAGE_KEYS.EMAIL, email);

  // Record the exact moment the user logged in so we can enforce
  // client-side expiry even when no API call has been made yet.
  localStorage.setItem(STORAGE_KEYS.LOGIN_AT, String(Date.now()));

  window.dispatchEvent(
    new CustomEvent("auth:change", { detail: { authenticated: true } }),
  );
};

export const clearAuth = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    if (
      key !== STORAGE_KEYS.REMEMBER_EMAIL &&
      key !== STORAGE_KEYS.REMEMBER_ME
    ) {
      localStorage.removeItem(key);
    }
  });
  window.dispatchEvent(
    new CustomEvent("auth:change", { detail: { authenticated: false } }),
  );
};

export const clearRememberedLogin = () => {
  localStorage.removeItem(STORAGE_KEYS.REMEMBER_EMAIL);
  localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
};

/**
 * Returns true if the stored login timestamp is missing or is older than
 * SESSION_EXPIRATION_DAYS days, meaning the session has expired on the client.
 */
export const isSessionExpired = () => {
  const loginAt = localStorage.getItem(STORAGE_KEYS.LOGIN_AT);
  if (!loginAt) return true;  // No timestamp → treat as expired
  return Date.now() - Number(loginAt) > SESSION_EXPIRATION_MS;
};

/**
 * Call this on app startup.  If the stored session is older than the allowed
 * expiry window, clear auth state and fire the session-expired event so the
 * UI can react (toast + redirect) without waiting for a 401 from the server.
 */
export const checkAndClearExpiredSession = () => {
  if (isAuthenticated() && isSessionExpired()) {
    clearAuth();
    window.dispatchEvent(new CustomEvent("auth:session-expired"));
  }
};

// 🔐 auth.js - Authentication Utilities
// Constants
// API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1"

// STORAGE_KEYS - Centralized localStorage key names

// Storage Keys
// TOKEN - JWT token

// USER - User object (JSON)

// USER_ID - User ID

// EMAIL - User email

// USERNAME - Username

// REMEMBER_EMAIL - Remembered email for login

// REMEMBER_ME - Remember me flag

// LOGIN_AT - Unix timestamp (ms) recorded when the user last logged in

// Core Functions & Function	Purpose
// getToken()	Get token from localStorage
// getUser()	Get user object (parsed JSON)
// getUserId()	Get user ID
// isAuthenticated()	Check if user has token, user, and userId
// setAuth()	Save all auth data after login (also records loginAt)
// clearAuth()	Remove all auth data (logout)
// clearRememberedLogin()	Clear only "Remember Me" data
// isSessionExpired()	True if loginAt is missing or older than SESSION_EXPIRATION_DAYS
// checkAndClearExpiredSession()	Call on app mount — auto-logout if session is expired

// Key Features
// ✅ Centralized storage key management

// ✅ JSON parsing with error handling

// ✅ Custom event dispatch on auth change

// ✅ Preserves "Remember Me" data on logout

// ✅ Client-side session expiry check (survives browser restart)

// ✅ SESSION_EXPIRATION_DAYS driven by VITE_SESSION_EXPIRATION_DAYS env var
