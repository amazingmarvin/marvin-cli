import { GET } from "../apiCall.ts";
import { getCSVHeader, toCSV } from "../csv.ts";
import { Params, Options } from "../types.ts";
import { globalFormatHelp, globalOptionHelp } from "../options.ts";

export default async function due(params: Params, cmdOpt: Options) {
  if (cmdOpt.help) {
    console.log(todayHelp);
    Deno.exit(0);
  }

  const res = await GET("/api/dueItems", { });

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
marvin due

List all open Tasks/Projects due today or earlier.

EXAMPLE:
    # List Tasks/Projects due today or earlier
    $ marvin due

OPTIONS:
${globalFormatHelp}
${globalOptionHelp}
`.trim();
