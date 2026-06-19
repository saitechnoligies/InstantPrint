import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Resolves once Clerk has actually finished hydrating (window.Clerk.loaded === true).
// On a cold/hard refresh this might take a beat; on warm tab switches it resolves
// almost instantly. Centralizing the wait here means every request made with this
// `api` instance is automatically protected, regardless of which component fires it.
function waitForClerk(timeoutMs = 8000) {
  return new Promise((resolve) => {
    if (window.Clerk?.loaded) return resolve(window.Clerk);

    const start = Date.now();
    const interval = setInterval(() => {
      if (window.Clerk?.loaded) {
        clearInterval(interval);
        resolve(window.Clerk);
      } else if (Date.now() - start > timeoutMs) {
        // Don't hang forever — let the request go out unauthenticated;
        // the backend will correctly 401 it instead of the UI hanging.
        clearInterval(interval);
        resolve(window.Clerk ?? null);
      }
    }, 50);
  });
}

// 🔥 THE FIX: Inject the dynamic token before every request, waiting for
// Clerk to be ready first instead of assuming it already is.
api.interceptors.request.use(
  async (config) => {
    try {
      const clerk = await waitForClerk();

      if (clerk?.session) {
        // getToken() automatically handles cache and refreshes
        const token = await clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Interceptor Auth Error:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

