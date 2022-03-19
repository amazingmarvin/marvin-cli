import { path } from "./deps.ts";
import * as localStorage from "./localStorage.ts";
import { Options, ResolvedOptions } from "./types.ts";

export const globalOptionHelp = `
    --desktop
        Don't fallback to using Marvin's public API if unable to communicate
        with the Amazing Marvin desktop app.

        By default marvin-cli attempts to communicate with the Amazing Marvin
        desktop app and falls back to using Marvin's public API.

    --host
        Which host to connect to when using desktop API. Defaults to
        "localhost".

    --port
        Which port to connect to when using desktop API. Defaults to 12082.

    --public
        Don't attempt to communicate with the Amazing Marvin desktop app and
        instead immediately use Marvin's public API.

        By default marvin-cli attempts to communicate with the Amazing Marvin
        desktop app and falls back to using Marvin's public API.
`.trimEnd();

export const globalFormatHelp = `
    --json
        Output JSON (this is the default). See
        https://github.com/amazingmarvin/MarvinAPI/wiki/Marvin-Data-Types for
        field documentation.

    --csv
        Output CSV. The output format is subject to change and isn't the same
        as regular CSV output from Marvin!

    --text
        Output plain text (just titles).
`.trimEnd();

function getSavedVal(key: string):number|string|boolean|null {
  const val = localStorage.getItem(key) || null;
  if (!val) {
    return val;
  }
  const parsedVal = JSON.parse(val);
  if (typeof parsedVal === "number" || typeof parsedVal === "string" || typeof parsedVal === "boolean") {
    return parsedVal;
  }
  return null;
}

let opt: ResolvedOptions;
export function setOptions(cmdOpt: Options) {
  opt = {
    port: 12082,
    host: "localhost",
    publicPort: 443,
    publicHost: "serv.amazingmarvin.com",
    apiToken: null,
    fullAccessToken: null,
    target: "default",
    json: false,
    quiet: false,
  };

  try {
    const savedPort = getSavedVal("port");
    if (typeof savedPort === "number") {
      opt.port = savedPort;
    }

    const savedPublicPort = getSavedVal("publicPort");
    if (typeof savedPublicPort === "number") {
      opt.publicPort = savedPublicPort;
    }

    const savedHost = getSavedVal("host");
    if (typeof savedHost === "string") {
      opt.host = savedHost;
    }

    const savedPublicHost = getSavedVal("publicHost");
    if (typeof savedPublicHost === "string") {
      opt.publicHost = savedPublicHost;
    }

    const savedApiToken = getSavedVal("apiToken");
    if (typeof savedApiToken === "string") {
      opt.apiToken = savedApiToken;
    }

    const savedFullAccessToken = getSavedVal("fullAccessToken");
    if (typeof savedFullAccessToken === "string") {
      opt.fullAccessToken = savedFullAccessToken;
    }

    const savedTarget = getSavedVal("target");
    if (savedTarget === "desktop" || savedTarget === "public" || savedTarget === "default") {
      opt.target = savedTarget;
    }

    const savedQuiet = getSavedVal("quiet");
    if (typeof savedQuiet === "boolean") {
      opt.quiet = savedQuiet;
    }
  } catch (err) { // eslint-disable-line
    // Probably config file doesn't exist
  }

  if (typeof cmdOpt.port === "number") {
    opt.port = cmdOpt.port;
  }

  if (typeof cmdOpt.host === "string") {
    opt.host = cmdOpt.host;
  }

  if (typeof cmdOpt["api-token"] === "string") {
    opt.apiToken = cmdOpt["api-token"];
  }

  if (typeof cmdOpt["full-access-token"] === "string") {
    opt.fullAccessToken = cmdOpt["full-access-token"];
  }

  if (cmdOpt.desktop) {
    opt.target = "desktop";
  } else if (cmdOpt.public) {
    opt.target = "public";
  }

  if (cmdOpt.quiet) {
    opt.quiet = true;
  }

  if (cmdOpt.json) {
    opt.json = true;
  }
}

export function getOptions(): ResolvedOptions {
  return opt;
}
