import { get } from "../apiCall.ts";
import { getCSVHeader, toCSV } from "../csv.ts";
import { Params, Options } from "../types.ts";
import { globalOptionHelp } from "../options.ts";

export default async function today(params: Params, cmdOpt: Options) {
  if (cmdOpt.help) {
    console.log(todayHelp);
    Deno.exit(0);
  }

  const res = await get("/api/todayItems", { });

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

export const todayHelp = `
marvin today # List Tasks/Projects scheduled today
marvin today --json # ... in JSON format (default)
marvin today --csv # ... in CSV format
marvin today --text # ... in plain text format

Create a Task or Project.

EXAMPLE:
    # Add a task
    $ marvin add task "Go to the store at 11:00 +today @chore"

    # Add an arbitrary item (by supplying JSON).
    $ marvin add --file=./task.json

    # Pipe JSON to stdin to create project
    $ cat project.json | marvin add -f -

OPTIONS:
    -f, --file=<path>
        Read JSON/text from file. Use - for stdin.
${globalOptionHelp}
`.trim();
