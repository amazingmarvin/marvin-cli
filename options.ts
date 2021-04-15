import { path } from "./deps.ts";
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
`;

export function getConfigDir(): string {
  const { os } = Deno.build;

  if (os === "darwin") {
    const homeDir = Deno.env.get("HOME");
    return homeDir ? `${homeDir}/Library/Preferences` : "";
  } else if (os === "windows") {
    return Deno.env.get("FOLDERID_RoamingAppData") || "";
  } else {
    const xdgHome = Deno.env.get("XDG_CONFIG_HOME");
    if (xdgHome) {
      return xdgHome;
    }

    const homeDir = Deno.env.get("HOME");
    return homeDir ? `${homeDir}/.config` : "";
  }
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
    const configDir = getConfigDir();
    const configFile = path.join(configDir, "marvin-cli.json");
    const json = Deno.readTextFileSync(configFile);
    const config = JSON.parse(json);

    if (typeof config.port === "number") {
      opt.port = config.port;
    }

    if (typeof config.publicPort === "number") {
      opt.publicPort = config.publicPort;
    }

    if (typeof config.host === "string") {
      opt.host = config.host;
    }

    if (typeof config.publicHost === "string") {
      opt.publicHost = config.publicHost;
    }

    if (typeof config.apiToken === "string") {
      opt.apiToken = config.apiToken;
    }

    if (typeof config.fullAccessToken === "string") {
      opt.fullAccessToken = config.fullAccessToken;
    }

    if (config.target === "desktop" || config.target === "public" || config.target === "default") {
      opt.target = config.target;
    }

    if (typeof config.quiet === "boolean") {
      opt.quiet = config.quiet;
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
