const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const path = require('path');
const types = ['default', 'moth', 'jojo', 'spoiler', 'nitro'];

module.exports = class DarkLightCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dark-light',
			aliases: ['dark-theme-light-theme', 'light-theme-dark-theme', 'dark-theme', 'light-theme', 'dtlt'],
			group: 'single',
			description: 'Determines whether you use dark or light theme.',
			details: `**Types:** ${types.join(', ')}`,
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'JoJo\'s Bizzare Adventure',
					url: 'http://www.araki-jojo.com/',
					reason: 'Original Anime'
				}
			],
			args: [
				{
					key: 'type',
					type: 'string',
					default: 'default',
					oneOf: types,
					parse: type => type.toLowerCase()
				}
			]
		});
	}

	run(msg, { type }) {
		return msg.say({
			files: [path.join(__dirname, '..', '..', 'assets', 'images', 'dark-light', `${type}.png`)]
		});
	}
};
