import fs from "fs";
import path from "path";

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  gradient: [string, string];
}

const TEAM_PATH = path.join(process.cwd(), "content", "team.json");

export function getTeamData(): TeamMember[] {
  const raw = fs.readFileSync(TEAM_PATH, "utf-8");
  return JSON.parse(raw);
}
