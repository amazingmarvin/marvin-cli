import { Task } from "./types.ts";

export function getCSVHeader(): string {
  return "ID,TITLE,DONE,DONE_AT,SCHEDULE_DATE,DUE_DATE,PRIORITY,FROG";
}

function csvEscape(str: number|string): string {
  if (typeof str === "number") {
    str = str.toString();
  }

  if (typeof str !== "string") {
    str = "";
  }

  if (str.indexOf(",") !== -1 || str.indexOf("\"") !== -1 || str.indexOf("\n") !== -1) {
    str = str.replace(/"/g, "\"\"");
    return `"${str}"`;
  }

  return str;
};

function getDate(d: string) {
  if (d === "unassigned") {
    return "";
  }

  return d || "";
}

export function toCSV(t: any): string {
  return [
    t._id,
    t.title,
    t.done ? "Y" : "N",
    t.doneAt || "",
    getDate(t.day),
    getDate(t.dueDate),
    t.isStarred || t.priority || 0,
    t.isFrogged || 0,
  ].map(csvEscape).join(",");
}
