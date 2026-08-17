export const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export const STORAGE_KEYS = {
  TOKEN: "authToken",
  USER: "authUser",
  USER_ID: "authUserId",
  EMAIL: "authEmail",
  USERNAME: "authUsername",
  REMEMBER_EMAIL: "rememberedEmail",
  REMEMBER_ME: "rememberMe",
};

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

// 🔐 auth.js - Authentication Utilities
// Constants
// API_BASE_URL = "http://127.0.0.1:8000/api/v1"

// STORAGE_KEYS - Centralized localStorage key names

// Storage Keys
// TOKEN - JWT token

// USER - User object (JSON)

// USER_ID - User ID

// EMAIL - User email

// USERNAME - Username

// REMEMBER_EMAIL - Remembered email for login

// REMEMBER_ME - Remember me flag

// Core Functions & Function	Purpose
// getToken()	Get token from localStorage
// getUser()	Get user object (parsed JSON)
// getUserId()	Get user ID
// isAuthenticated()	Check if user has token, user, and userId
// setAuth()	Save all auth data after login
// clearAuth()	Remove all auth data (logout)
// clearRememberedLogin()	Clear only "Remember Me" data

// Key Features
// ✅ Centralized storage key management

// ✅ JSON parsing with error handling

// ✅ Custom event dispatch on auth change

// ✅ Preserves "Remember Me" data on logout
