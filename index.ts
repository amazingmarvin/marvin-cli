import { parse } from "./deps.ts";
import { getOptions, setOptions } from "./options.ts";
import { Params, Options } from "./types.ts";

import add from "./commands/add.ts";
import backup from "./commands/backup.ts";
import config from "./commands/config.ts";
import help from "./commands/help.ts";
import ping from "./commands/ping.ts";
import profile from "./commands/profile.ts";
import restore from "./commands/restore.ts";

const VERSION = "0.1.0";

const commands: Record<string, (params: Params, options: Options) => Promise<void>> = {
  add,
  backup,
  config,
  help,
  ping,
  profile,
  restore,
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
    "version",
  ],
  string: [
    "file",
    "api-token",
    "full-access-token",
    "output",
  ],
});

if (cmdArgs.version) {
  console.log(`marvin-cli v${VERSION}`);
  Deno.exit(0);
}

// Print simple help if run without command.
if (cmdArgs._.length === 0 && cmdArgs.help) {
  printHelp();
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
    config - Get/set config values for marvin-cli
    add    - Add a Task, Project, or other
    update - Update a Task, Project, or other
    delete - Delete a Task, Project, or other
    help   - Help about any command

DESKTOP COMMANDS:
    run      - Start the desktop app
    quickAdd - Open desktop quick add
    backup   - Trigger backups
    restore  - Restore backups
    quit     - Shut down the app
`.trim());

  /*console.log(`
marvin-cli
Communicate with Amazing Marvin from the command line.

Be sure to update to the latest Amazing Marvin desktop app and enable the CLI
integration strategy.

\`\`\`bash
# One-time
echo "ysmIILz1a9C5BzsG4VgnKsfbgvo" | marvin login -
# Or
marvin login ./api-key.txt
\`\`\`

\`\`\`bash
# Add a task by title (with task input shortcuts)
marvin add task "Example task +today @next"
=> {"_id":"3rAnrBjzSP6HD7twABHH","db":"Tasks","title":"Example task","day":"2021-04-03","labelIds":["Fc2yvmfH6Rw9n"],...}
\`\`\`

\`\`\`bash
# Read a task from a file
marvin add task ./task.txt
\`\`\`

\`\`\`bash
# Read task from stdin
echo "Example task +today @next" | marvin add task -
\`\`\`

\`\`\`bash
# Can also add projects in the same way
marvin add project "Example project +2021-04-04"
\`\`\`

\`\`\`bash
# If no type given, then create from JSON
marvin add '{"_id":"123","db":"Tasks","title":"Example task",...}'
\`\`\`

\`\`\`bash
# Read from stdin
cat example.json | marvin add --json -
\`\`\`

\`\`\`bash
# Trigger a backup to default backup dir
marvin backup
\`\`\`

\`\`\`bash
# Run a backup to a file
marvin backup ./marvin-latest.json.lzma
\`\`\`

\`\`\`bash
# Backup to stdin
marvin backup - | lzma -d | json_pp
\`\`\`

\`\`\`bash
# Search a backup file for items matching text.
marvin backup search "Blog" --from="~/Documents/AmazingMarvinBackups/AmazingMarvinBackup_2021-01-14-22-11.json.lzma"
\`\`\`

\`\`\`bash
# Restore a particular backup.
marvin restore --from="~/Documents/AmazingMarvinBackups/AmazingMarvinBackup_2021-01-14-22-11.json.lzma"
\`\`\`
`.trim());*/
}
