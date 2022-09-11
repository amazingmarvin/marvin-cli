// GET and POST API requests to desktop local API server or public API.
import { getOptions } from "./options.ts";

async function apiCall(endpoint: string, headers: Record<string, string>, extraOptions: Record<string, any>): Promise<Response> {
  const opt = getOptions();
  if (!opt.apiToken) {
    console.error(`Missing apiToken. Either use "marvin config apiToken XYZ" or pass the --api-token command line option.`);
    Deno.exit(1);
  }

  let errorMessage;

  let tokenName: string, token: string;
  if (needsFullAccess(endpoint)) {
    tokenName = "X-Full-Access-Token";
    if (opt.fullAccessToken) {
      token = opt.fullAccessToken;
    } else {
      throw new Error("Full access needed. Use `marvin config fullAccessToken YOUR_TOKEN`.");
    }
  } else {
    tokenName = "X-API-Token";
    if (opt.apiToken) {
      token = opt.apiToken;
    } else {
      throw new Error("API token needed. Use `marvin config apiToken YOUR_TOKEN`.");
    }
  }

  if (!token) {
    throw new Error("Missing token");
  }

  // First try desktop
  if (opt.target !== "public") {
    try {
      const res = await fetch(`http://${opt.host}:${opt.port}${endpoint}`, {
        ...extraOptions,
        headers: {
          [tokenName]: token,
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
          [tokenName]: token,
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

export async function GET(endpoint: string, headers: Record<string, string>) {
  return apiCall(endpoint, headers, { method: "GET" });
}

export function POST(endpoint: string, body: string, headers: Record<string, string>) {
  return apiCall(endpoint, headers, { method: "POST", body });
}

function needsFullAccess(endpoint: string): boolean {
  if (endpoint.startsWith("/api/doc")) {
    return true;
  }

  return false;
}
