import { GET } from "../apiCall.ts";
import { globalOptionHelp } from "../options.ts";
import { printResult } from "../printResult.ts";
import { Params, Options } from "../types.ts";

// Get the currently tracked item
export default async function tracking(params: Params, cmdOpt: Options) {
  if (cmdOpt.help) {
    console.log(getHelp);
    Deno.exit(0);
  }

  // marvin tracking
  if (params.length === 0) {
    try {
      const res = await GET("/api/trackedItem", { });
      await printResult(res);
    } catch (err) {
      console.error(err.message);
      Deno.exit(1);
    }
    Deno.exit(0);
  }

  console.error(getHelp);
  Deno.exit(1);
}

export const getHelp = `
marvin tracking

Get the currently tracked item.

EXAMPLE:
    # Get a Task/Project/Event/etc. by ID
    $ marvin tracking

OPTIONS:
${globalOptionHelp}
`.trim();
