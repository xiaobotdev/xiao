const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');

module.exports = class FoxCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fox',
			group: 'random-img',
			description: 'Responds with a random fox image.',
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'RandomFox',
					url: 'https://randomfox.ca/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const { body } = await request.get('https://randomfox.ca/floof/');
		return msg.say({ files: [body.image] });
	}
};
