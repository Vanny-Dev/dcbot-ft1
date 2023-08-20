import path from "path";
import { Config, Level } from "./sequelize.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

const importJson = (file, impMeta) => {
	return JSON.parse(
		readFileSync(
			path.resolve(fileURLToPath(path.dirname(impMeta.url)), file),
			"utf8",
		),
	);
};

const levels = importJson("./levels.json", import.meta);

/**
 * @param {string} userId
 */
const initializeUser = async userId => {
	try {
		await Level.build({
			userId: userId,
			level: 1,
			xp: 0,
		}).save();
	} catch (e) {
		if (e.errors[0]) {
			if (e.errors[0].type === "unique violation") {
				return;
			} else {
				throw e;
			}
		}
	}
};

const getLevelAndXp = async function (userId) {
	return await Level.findOne({
		where: { userId },
	});
};

/**
 * @param {string} userId
 * @param {number} xp
 */
const increaseXp = async (userId, xp) => {
	const { level, xp: currentXp } = await getLevelAndXp(userId);
	const requiredXp = levels[level.toString()];

	const increasedXp = currentXp + xp;

	const isReached = increasedXp > requiredXp;

	await Level.update(
		isReached ? ({
			xp: increasedXp,
			level: level + 1
		}) : ({
			xp: increasedXp
		}),
		{
			where: { userId },
		}
	);

	return { isLeveledUp: false, level: null };
};

const getLevelingChannel = async guildId =>
	(
		await Config.findOne({
			where: { guildId },
		})
	)?.levelingChannel;

const isConfigInitialized = async guildId => {
	return (await Config.findOne({ where: { guildId } })) != null;
};

const initializeConfig = async guildId => {
	if (!(await isConfigInitialized(guildId))) {
		await Config.build({
			guildId,
			levelingChannel: null,
		}).save();
	}
};

export {
	increaseXp,
	initializeUser,
	getLevelAndXp,
	importJson,
	getLevelingChannel,
	initializeConfig,
};
