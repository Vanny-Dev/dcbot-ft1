import { resolve } from "path";
import { writeFileSync } from "fs";

const levelsLength = 75;
const accumulatedXpPerLevel = 60;
const levels = {};

for (let x = 1; x <= levelsLength; x++) {
	levels[x] = (accumulatedXpPerLevel * x) + ((x - 1) * 10);
}

writeFileSync(
	resolve(process.cwd(), "level/levels.json"),
	JSON.stringify(levels, null, 2),
	"utf8",
);
