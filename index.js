import {
	Client,
	Events,
	GatewayIntentBits,
	SlashCommandBuilder,
	AttachmentBuilder,
} from "discord.js";
import request from "request";
import { initializeDB } from "./db.js";
import leveling from "./level/leveling.js";
import { importJson } from "./level/utils.js";

(async () => {
	await initializeDB();
})();

const { token } = importJson("./config.json", import.meta);

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

//greetings
client.on(Events.MessageCreate, msg => {
	let input = msg.content;
	let person = msg.author.toString();
	let prefix = ">";

	if (!(msg.author.id === "1141665597126619206")) {
		if (/[gG]ood\s?[mM]orning+/.test(input)) {
			msg.reply(
				`Good morning to you as well, hope you have a nice day! ${person}`,
			);
		}

		if (/[gG]ood\s?[aA]fternoon+/.test(input)) {
			msg.reply(
				`Good afternoon to you, have you eaten lunch already? ${person}`,
			);
		}

		if (/[gG]ood\s?[eE]vening+/.test(input)) {
			msg.reply(
				`Good evening to you as well, hope you are doing well until now ${person}`,
			);
		}

		if (/[gG]ood\s?[nN]ight+/.test(input)) {
			msg.reply(`Good night to you buddy, have some rest mwuah 💗 ${person}`);
		}
	}
});

//features
client.on(Events.MessageCreate, msg => {
	//console.log(message)
	let input = msg.content;
	let person = msg.author.toString();
	let prefix = ">";

	// ignore messages from bot
	if (!msg.author.bot) {
		leveling(msg, prefix, msg.author);
	}

	if (input.startsWith(prefix + "run")) {
		let text = input.substring(5);
		let lang = text.split(" ");
		let script = text.substring(text.indexOf(" ") + 1);
		if (text.length <= 1) {
			msg.reply("Invalid Command\nUsage: " + prefix + "run <language> <codes>");
		} else {
			try {
				console.log(script);

				var program = {
					script: script,
					language: lang[0],
					versionIndex: "0",
					clientId: "ba88bf21ac8cee41df987d6a96794080",
					clientSecret:
						"4bc3d48db257f4cff8424ef812b3e2202e122d88a0f7cfba9848cbfa8d977ae7",
				};
				request(
					{
						url: "https://api.jdoodle.com/execute",
						method: "POST",
						json: program,
					},
					function (error, response, body) {
						//console.log('error:', error);
						//console.log('statusCode:', response && response.statusCode);
						//console.log('body:', body);

						msg.reply("Code Output:\n\n" + body.output);
						// console.log(program);
					},
				);
			} catch (err) {
				console.error(err.message);
			}
		}
	}
	if (input.startsWith(prefix + "spamNGL")) {
		let datas = input.substring(9);
		if (datas.length < 2) {
			msg.reply(
				"⚠️𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐔𝐬𝐞 𝐎𝐟 𝐂𝐨𝐦𝐦𝐚𝐧𝐝!\n💡𝐔𝐬𝐚𝐠𝐞: " +
					prefix +
					"spamNGL <username> <times> <text>",
			);
		} else {
			try {
				(async () => {
					const username = datas.split(" ")[0];
					const count = datas.split(" ")[1];
					const texts = datas.substring(datas.indexOf(" ") + count.length + 2);

					let deviceId = "",
						chars = "0123456789abcdefghijklmnopqrstuvwxyz-";
					for (i = 0; i < 36; i++) {
						idx = Math.floor(Math.random() * chars.length);
						deviceId += chars[idx];
					}

					//console.log('SUCCESSFULLY')
					let data = {
						username: `${username}`,
						question: `${texts}`,
						messageQuantity: `${count} times`,
						deviceId: deviceId,
					};
					function delay(milisec) {
						return new Promise(resolve => {
							setTimeout(() => {
								resolve("");
							}, milisec);
						});
					}

					for (let i = 0; i < `${count}`; i++) {
						await delay(3000);
						request.post(
							{
								url: "https://ngl.link/api/submit",
								form: data,
								headers: {
									Referer: `https://ngl.link/${username}`,
									"Content-Type":
										"application/x-www-form-urlencoded; charset=UTF-8",
									"user-agent":
										"Mozilla/5.0 (X11; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0",
								},
								method: "POST",
							},

							function (e, r, body) {
								try {
									const b = JSON.parse(body);
									const questionId = b.questionId;
									Object.assign(data, { questionId });
									console.log(data);
								} catch (errs) {
									//msg.react("❌", msg.author.id);
									console.log("The username you entered doesn't exist.");
								}
							},
						);
					}

					//respo
					//(async () => {
					//await delay(3000 * `${count}` + 20)
					msg.react("✅", msg.author.id);
					//console.log("Your spam requests has been delivered to the user.")
					//})()
				})();
			} catch (err) {
				msg.reply(`${err.message}`);
			}
		}
	}
	if (input.startsWith(prefix + "getQR")) {
		let data = input.split(" ");
		if (data.length < 2) {
			msg.reply("Invalid Command\nUsage: " + prefix + "getQR <your-inputs>");
		} else {
			data.shift();
			data = data.join(" ");

			const image = new AttachmentBuilder(
				"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" +
					encodeURIComponent(data),
				{ name: "img.png" },
			);
			msg.reply({ files: [image] });
		}
	}
	if (input.startsWith(prefix + "randomcat")) {
		const image = new AttachmentBuilder("https://cataas.com/cat", {
			name: "img.png",
		});
		msg.reply({ files: [image] });
	}
});

client.login(token);
