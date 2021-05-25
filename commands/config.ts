import { existsSync, path } from "../deps.ts";
import { getOptions } from "../options.ts";
import { Params, Options } from "../types.ts";

const whitelist = [
  "port",
  "host",
  "publicPort",
  "publicHost",
  "apiToken",
  "fullAccessToken",
  "target",
  "quiet",
];

// Set a config value or view current config.
export default async function config(params: Params, cmdOpt: Options) {
  let currentConfig = { };
  const options = getOptions();

  if (cmdOpt.help) {
    console.log(configHelp);
    Deno.exit(0);
  }

  if (params.length === 0) {
    console.log(`port: ${options.port}`);
    console.log(`host: ${options.host}`);
    console.log(`publicPort: ${options.publicPort}`);
    console.log(`publicHost: ${options.publicHost}`);
    console.log(`apiToken: ${(options.apiToken || "").replace(/.{20}$/, "...")}`);
    console.log(`fullAccessToken: ${(options.fullAccessToken || "").replace(/.{20}$/, "...")}`);
    console.log(`target: ${options.target}`);
    console.log(`json: ${options.json}`);
    console.log(`quiet: ${options.quiet}`);
    Deno.exit(0);
  }

  if (params.length !== 2) {
    console.error(configHelp);
    Deno.exit(1);
  }

  const key = params[0].toString();
  let val: string|number|boolean = params[1];

  if (whitelist.indexOf(key.toString()) === -1) {
    console.error(`Unrecognizd key "${key}". Run "marvin config -h" for help.`);
    Deno.exit(1);
  }

  if ((key === "port" || key === "publicPort") && typeof val !== "number") {
    console.error(`Invalid port "${val}" (expected a number). Use "marvin config -h" for help.`);
    Deno.exit(1);
  }

  if (key === "target" && val !== "desktop" && val !== "public" && val !== "default") {
    console.error(`Invalid target "${val}". Expected "desktop", "public", or "default". Use "marvin config -h" for help.`);
    Deno.exit(1);
  }

  if (key === "quiet") {
    if (val === "true") {
      val = true;
    } else if (val === "false") {
      val = false;
    } else {
      console.error(`Invalid quiet "${val}" (expected true or false). Use "marvin config -h" for help.`);
      Deno.exit(1);
    }
  }

  localStorage.setItem(key, JSON.stringify(val));
  if (!options.quiet) {
    console.log(`Saved ${key}=${val}`);
  }
  Deno.exit(0);
}

export const configHelp = `
marvin config # View current options
marvin config <key> <val> # Set key to val

PROPERTIES:
    marvin config port <port>
        Use the given port when connecting to the desktop app's local API
        server. This has no effect when using the public API. Be sure to use
        the same value you put in the desktop app's API strategy settings.

        The default port is 12082.

    marvin config host <address>
        Use the given address when connecting to the desktop app's local API
        server. This has no effect when using the public API. Be sure to
        configure the "listen" setting in the desktop app's API strategy
        settings if using a value other than localhost here (i.e. you'll
        probably need to use "0.0.0.0").

        The default host is "localhost".

    marvin config apiToken <your api token>
        Use the given API token by default so that you don't have to enter it
        with each use of marvin-cli. This is stored in localStorage.

        There is no default apiToken. marvin-cli will exit with an error
        unless you supply it with the --api-token option with each run, or here
        once.

    marvin config fullAccessToken <your full access token>
        Use the given full access token by default so that you don't have to
        enter it with each use of an API endpoint that requires it. This is
        stored in localStorage.

        There is no default fullAccessToken. marvin-cli will exit with an error
        if you try to use an endpoint that requires a fullAccessToken unless
        you supply it with the --full-access-token option with each run, or
        here once.

    marvin config target desktop|public|default Set "target" to "desktop" to
        tell marvin-cli to only connect to the
        desktop app's local API server (unless you run marvin-cli with the
        --public option).

        Set "target" to "public" to tell marvin-cli to only connect to the
        public API (unless you run marvin-cli with the --desktop option).

        Set "target" to "default" to tell marvin-cli to forget whatever other
        "target" option you previously told it to use.

    marvin config quiet true|false
        If true, then marvin-cli will suppress diagnostic output.
`.trim();
