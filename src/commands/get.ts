import { GET } from "../apiCall.ts";
import { globalOptionHelp } from "../options.ts";
import { printResult } from "../printResult.ts";
import { Params, Options } from "../types.ts";

// Get any document by ID.
export default async function get(params: Params, cmdOpt: Options) {
  if (cmdOpt.help) {
    console.log(getHelp);
    Deno.exit(0);
  }

  // marvin get (???)
  if (params.length === 0) {
    console.error(getHelp);
    Deno.exit(1);
  }

  // marvin get XYZ
  if (params.length === 1) {
    try {
      const docId = params[0];
      const res = await GET(`/api/doc?id=${docId}`, { "Content-Type": "text/plain" });
      await printResult(res);
      Deno.exit(0);
    } catch (err) {
      console.error(err.message);
      Deno.exit(1);
    }
  }

  console.error(getHelp);
  Deno.exit(1);
}

export const getHelp = `
marvin get <id>

Fetch a document

EXAMPLE:
    # Get a Task/Project/Event/etc. by ID
    $ marvin get XYZ

    # Get a value from profile
    $ marvin get strategySettings.labels

OPTIONS:
${globalOptionHelp}
`.trim();
