const { SlashCommandBuilder, Routes } = require('discord.js');
const { Collection } = require('@discordjs/collection');
const fs = require('fs');
const path = require('path');
const { TEST_GUILD_ID } = process.env;

module.exports = class SlashRegistry {
	constructor(client) {
		Object.defineProperty(this, 'client', { value: client });

		this.commands = new Collection();
	}

	registerCommand(command) {
		const slashCmd = new SlashCommandBuilder()
			.setName(command.name)
			.setDescription(command.description);
		this.commands.set(command.name, { command, data: slashCmd });
		return this;
	}

	registerCommandsIn(dir) {
		const commands = fs.readdirSync(dir);
		for (const command of commands) {
			if (!command.endsWith('.js')) continue;
			const Required = require(path.join(dir, command));
			this.registerCommand(new Required(this.client));
		}
		return this;
	}

	uploadTestCommands() {
		return this.client.rest.put(
			Routes.applicationGuildCommands(this.client.user.id, TEST_GUILD_ID),
			{ body: this.commands.map(cmd => cmd.data.toJSON()) }
		);
	}

	uploadGlobalCommands() {
		return this.client.rest.put(
			Routes.applicationCommands(this.client.user.id),
			{ body: this.commands.map(cmd => cmd.data.toJSON()) }
		);
	}
};
