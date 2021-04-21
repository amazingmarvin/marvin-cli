import { get } from "../apiCall.ts";
import { globalOptionHelp } from "../options.ts";
import { Params, Options, APIEndpoint } from "../types.ts";

const endpoints: Record<string, APIEndpoint> = {
  test: {
    title: "Test credentials",
    stability: "stable",
    servedBy: "both",
    method: "POST",
    fullAccessNeeded: false,
    description: `
You can test whether your credentials are correct with a POST:

__EXAMPLE__ test
=>
"OK"
__END__
    `.trim(),
  },
  addTask: {
    title: "Create a task",
    stability: "stable, backwards-compatible changes expected",
    servedBy: "both",
    method: "POST",
    fullAccessNeeded: false,
    description: `
You can quickly create a task with a POST request.

Note: send actual JSON. The following has inline documentation. 

__EXAMPLE__ addTask
{
  "done": false,
  "day": "2020-07-17",
  "title": "Work 30m homework #School", // supports some autocompletion (parent, day, dueDate, plannedWeek, plannedMonth, timeEstimate, labels, isStarred)
  "parentId": "xyz", // ID of parent category/project
  "labelIds": ["abc", "def"], // IDs of labels
  "firstScheduled": "2020-07-17",
  "rank": 999,
  "dailySection": "Morning",
  "bonusSection": "Essential", // or "Bonus"
  "customSection": "a3gnaiN31mz", // ID of custom section (from profile.strategySettings.customStructure)
  "timeBlockSection": "b00m3feaMbeaz", // ID of time block
  "note": "Problems 1-4",
  "dueDate": "2020-07-20",
  "timeEstimate": 3600000, // ms
  "isReward": false,
  "isStarred": 3,
  "isFrogged": 2,
  "plannedWeek": "2020-07-12",
  "plannedMonth": "2020-07",
  "rewardPoints": 1.25,
  "rewardId": "anbeN3mRneam", // Unique ID of attached Reward
  "backburner": true, // Manually put in backburner (can also be backburner from label, start date, etc.)
  "reviewDate": "2020-09-09",
  "timeEstimate": 300000, // duration estimate in ms
  "itemSnoozeTime": 1599577206923, // Date.now() until when it's snoozed
  "permaSnoozeTime": "09:00",


  // Time offset in minutes
  //
  // Added to time to fix time zone issues.  So if the user is in Pacific time,
  // this would be -8*60.  If the user added a task with +today at 22:00 local
  // time 2019-12-05, then we want to create the task on 2019-12-05 and not
  // 2019-12-06 (which is the server date).
  "timeZoneOffset": 60,
}
=> (...)
__END__

The title will be processed similar to autocompletion within Marvin. So if you use "Example task +today", then the task will be scheduled for today and " +today" will be removed from the title. If you put "#Parent Category" or "@label1 @label2" in the title, they will be resolved to their IDs when you open Marvin.

See Marvin data types for documentation about how these fields work. Only the above fields are consumed by this API. If you want to set other fields, add directly to the couchdb.

New in 1.60.0, you can also POST plain text.

__EXAMPLE__ addTask
Content-Type: text/plain
Example task +today @new
=> (...)
__END__

The response is currently undocumented since it's different in the public API
than the desktop app server. In the future it will return the new Task (with ID).

### Working sample code

\`\`\`bash
curl -H "X-API-Token: $MARVIN_TOKEN" -XPOST -d '{"title": "Example API task +today"}' https://serv.amazingmarvin.com/api/addTask
\`\`\`
`.trim(),
  },
  quickAdd: {
    title: "Open Quick-Add",
    stability: "upcoming",
    servedBy: "desktop",
    method: "POST",
    fullAccessNeeded: false,
    description: `
Open the Quick-Add window for adding a task with auto-completion.

__EXAMPLE__ quickAdd
=> OK
__END__
`.trim(),
  },
};

for (const name in endpoints) {
  const endpoint = endpoints[name];
  endpoint.description = endpoint.description.replace(/__EXAMPLE__ (\S+)([\s\S]+?)__END__/mg, (str, exampleEndpoint, reqRes) => {
    return [
      "```javascript",
      `${endpoint.method} /api/${exampleEndpoint}`,
      endpoint.fullAccessNeeded ? "X-Full-Access-Token: ABC" : "X-API-Token: XYZ",
      reqRes.trim(),
      "```",
    ].join("\n");
  });
}

/**
 * Test API commands.
 */
export default async function api(params: Params, cmdOpt: Options) {
  if (cmdOpt.help) {
    console.log(apiHelp);
    Deno.exit(0);
  }

  if (params.length === 0) {
    for (const name in endpoints) {
      const endpoint = endpoints[name];
      const target = endpoint.servedBy === "desktop" ? " (Desktop API only)" : endpoint.servedBy === "public" ? " (Public API only)" : "";
      console.log(`## ${endpoint.title}${target}`);
      console.log(`> ${endpoint.stability}`);
      console.log(endpoint.description);
      console.log();
    }

    Deno.exit(0);
  }
}

const apiHelp = `
marvin api # Print API docs
marvin api [ENDPOINT] [QUERY PARAMS]

Print API documentation markdown or call one of Marvin's API endpoints
directly. Probably only useful for Marvin development.

OPTIONS:
${globalOptionHelp}
`.trim();
