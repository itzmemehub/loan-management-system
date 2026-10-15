import axios from "axios";
import { endSession } from "./auth";

// The local default uses the Vite proxy. Production builds use the deployed
// backend unless a hosting environment provides its own VITE_API_URL.
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://loanzing-backend-production-bc7b.up.railway.app/api"
    : "/api");

// Where the backend serves uploaded files from (/uploads/...). Empty when the
// API is same-origin.
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

// withCredentials sends the HTTP-only session cookie.
const API = axios.create({ baseURL: API_URL, withCredentials: true });

// An expired or rejected admin session sends the admin back to sign in,
// instead of pages quietly showing no data.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes("/auth/");
    if (error.response?.status === 401 && !isAuthRequest) {
      endSession();
      const next = encodeURIComponent(window.location.pathname);
      window.location.assign(`/login?expired=1&next=${next}`);
    }
    return Promise.reject(error);
  }
);

export async function signOut() {
  try {
    await API.post("/auth/logout");
  } finally {
    endSession();
  }
}

// Full URL for a stored document: a data: URL (offline record), an absolute
// URL, or a path on the backend such as /uploads/file.pdf.
export const fileUrl = (value) => (value.startsWith("http") || value.startsWith("data:") ? value : `${API_ORIGIN}/${value.replace(/^[/\\]+/, "")}`);

export default API;
