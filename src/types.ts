// Command line args (other than flags/options).
export type Params = (string | number)[];

// Raw options as they come in from command line.
export type Options = Record<string, string|boolean|number>;

// Final options: populated by config file, and then possibly overwritten by
// command line options.
export type ResolvedOptions = {
  port: number,
  host: string,
  publicPort: number,
  publicHost: string,
  apiToken: string|null,
  fullAccessToken: string|null,
  target: "desktop" | "public" | "default",
  json: boolean,
  quiet: boolean,
};

export type APIEndpoint = {
  title: string,
  stability: string,
  servedBy: "desktop" | "public" | "both",
  method: "GET" | "POST",
  fullAccessNeeded: boolean,
  description: string,
  queryParams?: Record<string, string>, // query param => description
};

export type Subtask = {
  _id: string,
  title: string,
};

export type Task = {
  _id: string,
  title: string,
  done: boolean,
  doneAt: number,
  day: string,
  dueDate: string,
  labelIds: string[],
  duration: number,
  timeEstimate: number,
  isStarred: number,
  isFrogged: number,
  plannedWeek: string|null,
  plannedMonth: string|null,
  isReward: boolean,
  subtasks: Record<string, Subtask>,
  note: string,
  backburner: boolean,
  isPinned: boolean,
  dependsOn: Record<string, boolean>,
};
