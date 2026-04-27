import { useAuth } from "@clerk/clerk-react";

const BASE_URL = "http://localhost:8080";

async function authFetch(path, token, init = {}) {
  if (!token) {
    console.warn("[authFetch] no token yet, skipping request to", path);
    return null;
  }
  const res = await fetch(BASE_URL + path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
      ...init.headers,
    },
  });
  if (!res.ok) throw new Error(res.status + " " + res.statusText);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export function useApiClient() {
  const { getToken } = useAuth();

  return {
    get: async (path) => {
      const token = await getToken();
      return authFetch(path, token);
    },
    post: async (path, body) => {
      const token = await getToken();
      return authFetch(path, token, {
        method: "POST",
        body: body != null ? JSON.stringify(body) : undefined,
      });
    },
    del: async (path) => {
      const token = await getToken();
      return authFetch(path, token, { method: "DELETE" });
    },
  };
}
