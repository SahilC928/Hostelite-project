import axios from "axios";

const isLocalHost = () => {
  if (typeof window === "undefined") return false;
  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
};

const getBaseURL = () => {
  const configuredBaseURL = import.meta.env.VITE_API_URL || window?.__API_BASE_URL__;
  if (configuredBaseURL) return configuredBaseURL.replace(/\/$/, "");
  return isLocalHost() ? "http://localhost:5001/api" : "/api";
};

const readDemoUsers = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("hostelite-demo-users") || "[]") || [];
  } catch {
    return [];
  }
};

const writeDemoUsers = (users) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("hostelite-demo-users", JSON.stringify(users));
  }
};

const createDemoUser = (payload) => {
  const users = readDemoUsers();
  const existingUser = users.find(
    (user) => user.email.toLowerCase() === payload.email.toLowerCase()
  );

  if (existingUser) {
    const error = new Error("User already exists");
    error.response = { status: 400, data: { message: "User already exists" } };
    throw error;
  }

  const newUser = {
    id: `${Date.now()}`,
    name: payload.name,
    email: payload.email,
    role: payload.role || "student",
    password: payload.password,
  };

  users.push(newUser);
  writeDemoUsers(users);
  return newUser;
};

const loginDemoUser = (payload) => {
  const users = readDemoUsers();
  const matchedUser = users.find(
    (user) =>
      user.email.toLowerCase() === payload.email.toLowerCase() &&
      user.password === payload.password
  );

  if (!matchedUser) {
    const error = new Error("Invalid email or password");
    error.response = { status: 401, data: { message: "Invalid email or password" } };
    throw error;
  }

  const { password, ...safeUser } = matchedUser;
  return safeUser;
};

const API = axios.create({
  baseURL: getBaseURL(),
});

API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error?.config || {};
    const isAuthRequest = config.url?.includes("/auth/login") || config.url?.includes("/auth/register");
    const isOfflineMode =
      typeof window !== "undefined" &&
      !import.meta.env.VITE_API_URL &&
      !window.__API_BASE_URL__ &&
      (!error.response || error.response.status === 404 || error.response.status >= 500 || error.code === "ERR_NETWORK" || error.code === "NETWORK_ERROR");

    if (isAuthRequest && isOfflineMode) {
      if (config.url?.endsWith("/auth/register")) {
        const payload = JSON.parse(config.data || "{}");
        const newUser = createDemoUser(payload);
        return Promise.resolve({
          data: {
            user: { ...newUser, password: undefined },
            token: `demo-${newUser.id}`,
          },
          status: 201,
          statusText: "OK",
          config,
          headers: {},
        });
      }

      if (config.url?.endsWith("/auth/login")) {
        const payload = JSON.parse(config.data || "{}");
        const user = loginDemoUser(payload);
        return Promise.resolve({
          data: {
            user,
            token: `demo-${user.id}`,
          },
          status: 200,
          statusText: "OK",
          config,
          headers: {},
        });
      }
    }

    return Promise.reject(error);
  }
);

export default API;
