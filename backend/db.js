import fs from "fs";

const DB_FILE = "feeds.json";

export function loadFeeds() {
  if (fs.existsSync(DB_FILE)) {
    return JSON.parse(fs.readFileSync(DB_FILE));
  }
  return {};
}

export function saveFeeds(feeds) {
  fs.writeFileSync(DB_FILE, JSON.stringify(feeds, null, 2));
}
