const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const UNAVAILABLE_MESSAGE = "Server is starting up or temporarily unavailable. Please try again in a few seconds.";

export const getToken = () => localStorage.getItem("token");
export const setToken = (t) =>
  t ? localStorage.setItem("token", t) : localStorage.removeItem("token");
export const getUsername = () => localStorage.getItem("username");
export const setUsername = (n) =>
  n ? localStorage.setItem("username", n) : localStorage.removeItem("username");

export async function api(path, method = "GET", body) {
  let res;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    try {
      res = await fetch(BASE + path, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { Authorization: "Bearer " + getToken() } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch {
      if (attempt === 0) continue;
      throw new Error(UNAVAILABLE_MESSAGE);
    } finally {
      clearTimeout(timeoutId);
    }
    if (attempt === 0 && [502, 503, 504].includes(res.status)) continue;
    break;
  }
  let data = null;
  try {
    data = await res.json();
  } catch {}
  if (!res.ok) {
    if (res.status >= 500) throw new Error(UNAVAILABLE_MESSAGE);
    if (res.status === 401 && !path.startsWith("/api/auth")) {
      setToken(null);
      setUsername(null);
      window.location.href = "/";
    }
    throw new Error(data?.errors?.[0]?.defaultMessage || data?.message || "Something went wrong");
  }
  return data;
}

export async function wakeBackend(signal) {
  const deadline = Date.now() + 90000;
  while (!signal?.aborted && Date.now() < deadline) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const abortWake = () => controller.abort();
    signal?.addEventListener("abort", abortWake, { once: true });
    try {
      const res = await fetch(BASE + "/api/health", { signal: controller.signal });
      if (res.ok) return true;
    } catch {
      // Keep polling while the backend starts.
    } finally {
      clearTimeout(timeoutId);
      signal?.removeEventListener("abort", abortWake);
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  return false;
}

export const getRole = () => localStorage.getItem("role");
export const setRole = (r) =>
  r ? localStorage.setItem("role", r) : localStorage.removeItem("role");
