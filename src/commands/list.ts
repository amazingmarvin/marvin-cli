import { get } from "../apiCall.ts";
import { getCSVHeader, toCSV } from "../csv.ts";
import { Params, Options } from "../types.ts";
import { globalOptionHelp } from "../options.ts";

export default async function list(params: Params, cmdOpt: Options) {
  if (cmdOpt.help) {
    console.log(listHelp);
    Deno.exit(0);
  }

  const res = await get(`/api/list?filter=${encodeURIComponent(cmdOpt.filter || "")}`, { });

  const items = await res.json();

  if (cmdOpt.csv) {
    console.log(getCSVHeader());
    for (const item of items) {
      console.log(toCSV(item));
    }
    Deno.exit(0);
  }

  if (cmdOpt.text) {
    for (const item of items) {
      console.log(item.title);
    }
    Deno.exit(0);
  }

  console.log(items);
  Deno.exit(0);
}

export const listHelp = `
marvin today # List Tasks/Projects scheduled today
marvin today --json # ... in JSON format (default)
marvin today --csv # ... in CSV format
marvin today --text # ... in plain text format

List or filter all open Tasks/Projects.

EXAMPLE:
    # List all tasks/projects
    $ marvin list

    # List all tasks as CSV
    $ marvin list --csv

    # List starred tasks
    $ marvin list --filter "type:task *isStarred &&"

OPTIONS:
    -f, --file=<path>
        Read JSON/text from file. Use - for stdin.
${globalOptionHelp}
`.trim();
