// GET and POST API requests to desktop local API server or public API.
import { getOptions } from "./options.ts";

async function apiCall(endpoint: string, headers: Record<string, string>, extraOptions: Record<string, any>): Promise<Response> {
  const opt = getOptions();
  if (!opt.apiToken) {
    console.error(`Missing apiToken. Either use "marvin config apiToken XYZ" or pass the --api-token command line option.`);
    Deno.exit(1);
  }

  let errorMessage;

  // First try desktop
  if (opt.target !== "public") {
    try {
      const res = await fetch(`http://${opt.host}:${opt.port}${endpoint}`, {
        ...extraOptions,
        headers: {
          "X-API-Token": opt.apiToken,
          ...headers,
        },
      });

      if (res.ok) {
        return res;
      }

      errorMessage = `[${res.status}] `;
      const text = await res.text();
      if (text) {
        errorMessage += text;
      } else {
        errorMessage += res.statusText;
      }
    } catch (err) {
      errorMessage = err.message;
    }
  }

  // Then fallback to public
  if (opt.target !== "desktop") {
    try {
      const scheme = opt.publicPort === 443 ? "https:" : "http:";
      const res = await fetch(`${scheme}//${opt.publicHost}:${opt.publicPort}${endpoint}`, {
        ...extraOptions,
        headers: {
          "X-API-Token": opt.apiToken,
          ...headers,
        },
      });

      if (res.ok) {
        return res;
      }

      errorMessage = `[${res.status}] `;
      const text = await res.text();
      if (text) {
        errorMessage += text;
      } else {
        errorMessage += res.statusText;
      }
    } catch (err) {
      errorMessage = err.message;
    }
  }

  const error = new Error(errorMessage.trim());
  return Promise.reject(error);
}

export async function get(endpoint: string, headers: Record<string, string>) {
  return apiCall(endpoint, headers, { method: "GET" });
}

export function post(endpoint: string, body: string, headers: Record<string, string>) {
  return apiCall(endpoint, headers, { method: "POST", body });
}
