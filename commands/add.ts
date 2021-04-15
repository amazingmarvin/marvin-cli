import { post } from "../apiCall.ts";
import { globalOptionHelp } from "../options.ts";
import { printResult } from "../printResult.ts";
import { Params, Options } from "../types.ts";

// Add a task or project.
export default async function add(params: Params, cmdOpt: Options) {
  if (cmdOpt.help) {
    console.log(addHelp);
    Deno.exit(0);
  }

  // echo "example" | marvin add --file=-
  if (params.length === 0 && cmdOpt.file === "-") {
    // Read stdin
    console.log("Not yet implemented");
    Deno.exit(1);
  }

  // marvin add --file=task.json
  if (params.length === 0 && cmdOpt.file) {
    // Read file
    try {
      const text = Deno.readTextFileSync(cmdOpt.file.toString());
      if (!text) {
        throw new Error("File was empty");
      }

      let contentType = "text/plain", endpoint = "/api/addTask";

      if (text[0] === "{") {
        try {
          const item = JSON.parse(text);
          contentType = "application/json";
          if (item.db === "Categories") {
            endpoint = "/api/addProject";
          }
        } catch (err) { } // eslint-disable-line
      }

      const res = await post(endpoint, text, { "Content-Type": contentType });
      await printResult(res);
      Deno.exit(0);
    } catch (err) {
      console.error(err.message);
      Deno.exit(1);
    }
  }

  // marvin add (???)
  if (params.length === 0) {
    console.error(addHelp);
    Deno.exit(1);
  }

  // marvin add task (???)
  if (params.length === 1 && (params[0] === "task" || params[0] === "project")) {
    // Invalid: if "add task" or "add project", user must give title as arg.
    console.error(addHelp);
    Deno.exit(1);
  }

  // marvin add task "example task +today"
  if (params.length === 2 && params[0] === "task") {
    // Add a task by title.
    try {
      const res = await post("/api/addTask", params[1].toString(), { "Content-Type": "text/plain" });
      await printResult(res);
      Deno.exit(0);
    } catch (err) {
      console.error(err.message);
      Deno.exit(1);
    }
  }

  // marvin add project "example due tomorrow"
  if (params.length === 2 && params[0] === "project") {
    try {
      const res = await post("/api/addProject", params[1].toString(), { "Content-Type": "text/plain" });
      await printResult(res);
      Deno.exit(0);
    } catch (err) {
      console.error(err.message);
      Deno.exit(1);
    }
  }

  console.error(addHelp);
  Deno.exit(1);
}

export const addHelp = `
marvin add [type] <title> # type is task or project
marvin add --file=<path>

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
