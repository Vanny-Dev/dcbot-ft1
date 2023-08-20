import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "app.db",
	logging: false,
});

const Level = sequelize.define("level", {
	userId: {
		primaryKey: true,
		type: DataTypes.STRING,
		unique: true,
	},
	level: DataTypes.INTEGER,
	xp: DataTypes.INTEGER,
});

const Config = sequelize.define("config", {
	guildId: {
		primaryKey: true,
		type: DataTypes.STRING,
		unique: true,
	},
	levelingChannel: {
		type: DataTypes.STRING,
		allowNull: true,
	},
});

export { Level, Config };
