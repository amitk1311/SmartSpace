// API Configuration and helper functions
const API_BASE = "http://localhost:4000";

let authToken = localStorage.getItem("token");
let currentUserId = localStorage.getItem("userId");

export const setAuthToken = (token, userId) => {
  authToken = token;
  currentUserId = userId;
  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
};

export const getAuthToken = () => authToken;
export const getCurrentUserId = () => currentUserId;
export const clearAuth = () => {
  authToken = null;
  currentUserId = null;
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
};

const apiCall = async (method, endpoint, data = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (authToken) {
    options.headers["Authorization"] = `Bearer ${authToken}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "API Error");
  }

  return result;
};

// Auth API
export const api = {
  auth: {
    register: (name, email, password, confirmPassword) =>
      apiCall("POST", "/api/auth/register", { name, email, password, confirmPassword }),
    login: (email, password) =>
      apiCall("POST", "/api/auth/login", { email, password }),
  },

  communities: {
    list: () => apiCall("GET", "/api/communities"),
    get: (id) => apiCall("GET", `/api/communities/${id}`),
    create: (name, code, description, category) =>
      apiCall("POST", "/api/communities", { name, code, description, category }),
    join: (id) => apiCall("POST", `/api/communities/${id}/join`),
    leave: (id) => apiCall("POST", `/api/communities/${id}/leave`),
    delete: (id) => apiCall("DELETE", `/api/communities/${id}`),
  },

  spaces: {
    list: (communityId) =>
      apiCall("GET", `/api/communities/${communityId}/spaces`),
    create: (communityId, name, description, type, capacity, open, close) =>
      apiCall("POST", `/api/communities/${communityId}/spaces`, {
        name,
        description,
        type,
        capacity,
        open,
        close,
      }),
    delete: (id) => apiCall("DELETE", `/api/spaces/${id}`),
  },

  rooms: {
    create: (spaceId, name, capacity, amenities) =>
      apiCall("POST", `/api/spaces/${spaceId}/rooms`, { name, capacity, amenities }),
    delete: (id) => apiCall("DELETE", `/api/rooms/${id}`),
  },

  bookings: {
    list: (userId) => apiCall("GET", `/api/bookings/user/${userId}`),
    create: (communityId, spaceId, roomId, tableNumber, bookingDate, startTime, endTime) =>
      apiCall("POST", "/api/bookings", {
        communityId,
        spaceId,
        roomId,
        tableNumber,
        bookingDate,
        startTime,
        endTime,
      }),
    cancel: (id) => apiCall("POST", `/api/bookings/${id}/cancel`),
    getByDate: (spaceId, date) =>
      apiCall("GET", `/api/spaces/${spaceId}/bookings/${date}`),
  },

  dashboard: {
    get: () => apiCall("GET", "/api/dashboard"),
  },

  notifications: {
    list: () => apiCall("GET", "/api/notifications"),
    markRead: () => apiCall("POST", "/api/notifications/mark-read"),
  },
};
