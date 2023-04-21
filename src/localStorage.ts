import { existsSync, moveSync, path } from "./deps.ts";

const storageFile = "marvin-cli.json";
let storagePath = "";
switch (Deno.build.os) {
case "linux": {
  const xdgConfigHomeDir = Deno.env.get("XDG_CONFIG_HOME");
  if (xdgConfigHomeDir) {
    storagePath = path.join(xdgConfigHomeDir, storageFile);
    break;
  }

  const homeDir = Deno.env.get("HOME");
  if (homeDir) {
    storagePath = path.join(homeDir, ".config", storageFile);

    // Mistakenly defaulted to ~/marvin-cli.json.
    const oldStoragePath = path.join(homeDir, storageFile);
    if (!existsSync(storagePath) && existsSync(oldStoragePath)) {
      moveSync(oldStoragePath, storagePath);
    }

    break;
  }

  break;
}
case "darwin": {
  const homeDir = Deno.env.get("HOME");
  if (homeDir) {
    storagePath = path.join(homeDir, "Library", "Preferences", storageFile);
    break;
  }

  break;
}
case "windows": {
  const roamingDir = Deno.env.get("FOLDERID_RoamingAppData");
  if (roamingDir) {
    storagePath = path.join(roamingDir, storageFile);
  }

  break;
}
default:
  console.error(`Unknown platform: ${Deno.build.os}`);
  break;
}

if (!storagePath) {
  storagePath = path.join(".", storageFile);
  console.error("Config path not found. Using current directory.");
}

let cache: Record<string, string>;
if (existsSync(storagePath)) {
  try {
    const json = Deno.readTextFileSync(storagePath);
    cache = JSON.parse(json);
  } catch (err) {
    cache = { };
    console.error("Failed to read/parse storage:", err.message);
  }
} else {
  console.log("Creating cache");
  cache = { };
  Deno.writeTextFileSync(storagePath, "{}");
}


export function getItem(key: string): string|null {
  if (key in cache) {
    return cache[key];
  }

  return null;
}

export function setItem(key: string, val: string): void {
  try {
    cache[key] = val;
    const newJson = JSON.stringify(cache, null, 2);
    Deno.writeTextFileSync(storagePath, newJson);
  } catch (err) {
    console.error("Failed to write local storage:", err.message);
  }
}

export function removeItem(key: string): void {
  try {
    delete cache[key];
    const newJson = JSON.stringify(cache, null, 2);
    Deno.writeTextFileSync(storagePath, newJson);
  } catch (err) {
    console.error("Failed to read/write local storage:", err.message);
  }
}

export function clear(): void {
  cache = { };
  Deno.writeTextFileSync(storagePath, "{}");
}
