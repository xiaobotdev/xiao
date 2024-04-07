const Command = require('../../framework/Command');
const { DataResolver } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { XIAO_TOKEN } = process.env;
const rest = new REST({ version: '10' }).setToken(XIAO_TOKEN);

module.exports = class BannerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'banner',
			group: 'util',
			memberName: 'banner',
			description: 'Sets the bot\'s banner.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true,
			args: [
				{
					key: 'image',
					type: 'image'
				}
			]
		});
	}

	async run(msg, { image }) {
		await rest.patch(Routes.user(), {
			body: { banner: await DataResolver.resolveImage(image) }
		});
		return msg.say('Set the banner.');
	}
};
