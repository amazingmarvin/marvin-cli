import { GET } from "../apiCall.ts";
import { getCSVHeader, toCSV } from "../csv.ts";
import { Params, Options } from "../types.ts";
import { globalFormatHelp, globalOptionHelp } from "../options.ts";

export default async function today(params: Params, cmdOpt: Options) {
  if (cmdOpt.help) {
    console.log(todayHelp);
    Deno.exit(0);
  }

  const res = await GET("/api/todayItems", { });

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
marvin today

List all Tasks/Projects scheduled today. Items completed today are not included.

EXAMPLE:
    # List Tasks/Projects scheduled today
    $ marvin today

OPTIONS:
${globalFormatHelp}
${globalOptionHelp}
`.trim();
