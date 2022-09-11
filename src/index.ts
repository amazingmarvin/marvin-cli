import { parse } from "./deps.ts";
import { getOptions, setOptions } from "./options.ts";
import { Params, Options } from "./types.ts";

import add from "./commands/add.ts";
import api from "./commands/api.ts";
import backup from "./commands/backup.ts";
import config from "./commands/config.ts";
import due from "./commands/due.ts";
import get from "./commands/get.ts";
import help from "./commands/help.ts";
import list from "./commands/list.ts";
import ping from "./commands/ping.ts";
import profile from "./commands/profile.ts";
import quickAdd from "./commands/quickAdd.ts";
import restore from "./commands/restore.ts";
import today from "./commands/today.ts";

const VERSION = "0.4.0";

const commands: Record<string, (params: Params, options: Options) => Promise<void>> = {
  add,
  api,
  backup,
  config,
  due,
  get,
  help,
  list,
  ping,
  profile,
  quickAdd,
  restore,
  today,
};

const cmdArgs = parse(Deno.args, {
  alias: {
    f: "file",
    h: "help",
    o: "output",
    q: "quiet",
    V: "version",
  },
  boolean: [
    "force",
    "help",
    "quiet",
    "desktop", // Connect to desktop or fail (default is desktop with public API fallback)
    "public", // Don't attempt to connect to desktop (default is desktop with public API fallback)
    "json", // JSON output
    "with-secrets",
    "csv", // CSV output
    "text", // text output
    "version",
    "done", // List completed tasks
  ],
  string: [
    "file",
    "api-token",
    "full-access-token",
    "output",
    "filter", // Supply an advanced filter
  ],
});

if (cmdArgs.version) {
  console.log(`marvin-cli v${VERSION}`);
  Deno.exit(0);
}

// Print simple help if run without command.
if (cmdArgs._.length === 0 && cmdArgs.help) {
  printHelp();
  Deno.exit(0);
} else if (cmdArgs._.length === 0) {
  console.log(`
marvin-cli
CLI access to Amazing Marvin

Usage:
    marvin COMMAND [OPTIONS]

Example:
    marvin add task "Go to the store at 11:00 +today @chore"

For a listing of commands and options, use marvin --help.
`.trim());
  Deno.exit(0);
}

const {
  _: [command, ...params],
  ...cmdOpt
} = cmdArgs;
setOptions(cmdOpt);

const desktopOnly = [
  "run",
  "quickAdd",
  "list",
  "backup",
  "restore",
  "quit",
];

// For desktop-only commands, error out if user tries to run against public
// API.
if (desktopOnly.indexOf((command || "").toString()) !== -1) {
  const opt = getOptions();
  if (opt.target === "public") {
    console.error(`The command "${command}" is only available on desktop.`);
    console.error(`Try running with --desktop`);
  } else if (opt.target === "default") {
    opt.target = "desktop";
  }
}

if (command in commands) {
  commands[command.toString()](params, cmdOpt);
} else {
  printHelp();
  Deno.exit(1);
}

function printHelp() {
  console.log(`
marvin-cli
CLI access to Amazing Marvin

Docs: https://github.com/amazingmarvin/marvin-cli
Bugs: https://github.com/amazingmarvin/marvin-cli/issues

USAGE:
    marvin [OPTIONS] [SUBCOMMAND]

OPTIONS:
    -h, --help
        Print this help

    -q, --quiet
        Suppress diagnostic messages. Errors will still be printed to stderr.

    -V, --version
        Print version info

COMMANDS:
    api    - View API docs
    config - Get/set config values for marvin-cli
    add    - Add a Task, Project, or other
    due    - Get open Tasks & Projects due today (or earlier)
    get    - Read an arbitrary document from your database
    today  - List Tasks and Projects that are scheduled today
    update - Update a Task, Project, or other
    delete - Delete a Task, Project, or other
    help   - Help about any command

DESKTOP COMMANDS:
    run      - Start the desktop app
    quickAdd - Open desktop quick add
    list     - List Tasks/Projects, optionally filtered
    backup   - Trigger backups
    restore  - Restore backups
    quit     - Shut down the app
`.trim());
}
