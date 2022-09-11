import { GET } from "../apiCall.ts";
import { getCSVHeader, toCSV } from "../csv.ts";
import { Params, Options } from "../types.ts";
import { globalFormatHelp, globalOptionHelp } from "../options.ts";

export default async function list(params: Params, cmdOpt: Options) {
  if (cmdOpt.help) {
    console.log(listHelp);
    Deno.exit(0);
  }

  const res = await GET(`/api/list?filter=${encodeURIComponent(cmdOpt.filter || "")}&done=${cmdOpt.done}`, { });

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
List or filter all open Tasks/Projects.

EXAMPLE:
    # List all tasks/projects
    $ marvin list

    # List all completed tasks as CSV. Note: Tasks/Projects completed more than
    # 6 weeks ago will not be shown unless your desktop app is in archive mode.
    $ marvin list --done --csv

    # List starred Tasks
    $ marvin list --filter "type:task *isStarred &&"

OPTIONS:
    --done
        Show completed items instead of open items.

    --filter "..."
        Use an advanced filter to show matching items. For documentation, see
        https://help.amazingmarvin.com/en/articles/2070779-advanced-smart-list-filters
${globalFormatHelp}
${globalOptionHelp}
`.trim();
