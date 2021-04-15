import { getOptions } from "./options.ts";

export async function printResult(res: Response): Promise<void> {
  const options = getOptions();
  if (!options.quiet) {
    if (res.headers.get("Content-Type") === "application/json") {
      const json = await res.json();
      if (options.json) {
        console.log(JSON.stringify(json));
      } else {
        console.log(json);
      }
    } else {
      const text = await res.text();
      console.log(text);
    }
  }
}
