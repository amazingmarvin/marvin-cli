// Command line args (other than flags/options).
export type Params = (string | number)[];

// Raw options as they come in from command line.
export type Options = Record<string, string|boolean|number>;

// Final options: populated by config file, and then possibly overwritten by
// command line options.
export type ResolvedOptions = {
  port: number,
  host: string,
  publicPort: number,
  publicHost: string,
  apiToken: string|null,
  fullAccessToken: string|null,
  target: "desktop" | "public" | "default",
  json: boolean,
  quiet: boolean,
};

export type APIEndpoint = {
  title: string,
  stability: string,
  method: "GET" | "POST",
  fullAccessNeeded: boolean,
  description: string,
  queryParams?: Record<string, string>, // query param => description
};
