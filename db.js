import { Config, Level } from "./level/sequelize.js";

async function initializeDB() {
	await Level.sync();
	await Config.sync();
}

export { initializeDB };
