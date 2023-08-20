import { AttachmentBuilder } from "discord.js";
import cvc from "canvacord";
import random from 'random';
import { initializeUser, increaseXp, getLevelAndXp, importJson, getLevelingChannel, initializeConfig } from "./utils.js";

const levels = importJson("./levels.json", import.meta);
const { Rank } = cvc;

/**
 * @typedef {import('discord.js').Message<boolean>} Message
 * @typedef {import('discord.js').User} User
 */

/**
 * @callback MessageCreate
 * @param {Message} msg
 */

/**
 * @type {Object.<string, MessageCreate>}
 */
const commands = {
	level: async msg => {
		const a = msg.author;
		await msg.channel.sendTyping();

    const { level, xp } = await getLevelAndXp(a.id);

    const data = await new Rank()
      .setRequiredXP(levels[level.toString()])
      .setCurrentXP(xp)
      .setLevel(level)
      .setAvatar(a.avatarURL())
      .setProgressBar("aquamarine")
      .setUsername(a.username)
      .setRank(0)
      .build();
    
    const attachment = new AttachmentBuilder(data, {
      name: "level-" + a.id + ".png",
    });

    msg.channel.send({
      files: [attachment],
    });
	},
};

/**
 * @param {Message} msg
 * @param {string} prefix
 * @param {User} author
 */
export default async function (msg, prefix, author) {
	const id = author.id;
  const guildId = msg.guildId;

	await Promise.all([
    initializeUser(id),
    initializeConfig(guildId)
  ]);

	const comm = msg.content.replace(prefix, "");
	await (commands[comm] || (() => {}))(msg);

  let { isLeveledUp, level } = await increaseXp(id, random.int(5, 8));

  const configLevChannelId = await getLevelingChannel(guildId);
  
  let levChannel = msg.channel;

  if (configLevChannelId != null){
    levChannel = await msg.guild.channels.fetch(configLevChannelId)
  }

  if (isLeveledUp) {
    levChannel.send(`${author.toString()} has reached level **${level}**! Sheesh!`);
  }
}
