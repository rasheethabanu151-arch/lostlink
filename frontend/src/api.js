const BASE = import.meta.env.VITE_API_URL || "";

export const getToken = () => localStorage.getItem("token");
export const setToken = (t) =>
  t ? localStorage.setItem("token", t) : localStorage.removeItem("token");
export const getUsername = () => localStorage.getItem("username");
export const setUsername = (n) =>
  n ? localStorage.setItem("username", n) : localStorage.removeItem("username");

export async function api(path, method = "GET", body) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: "Bearer " + getToken() } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {}
  if (!res.ok) {
    if ((res.status === 401 || res.status === 403) && !path.startsWith("/api/auth")) {
      setToken(null);
      setUsername(null);
      window.location.href = "/";
    }
    throw new Error(data?.errors?.[0]?.defaultMessage || data?.message || "Something went wrong");
  }
  return data;
}

export const getRole = () => localStorage.getItem("role");
export const setRole = (r) =>
  r ? localStorage.setItem("role", r) : localStorage.removeItem("role");
