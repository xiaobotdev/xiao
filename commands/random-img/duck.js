const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');

module.exports = class DuckCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'duck',
			aliases: ['ducky', 'quack'],
			group: 'random-img',
			description: 'Responds with a random duck image.',
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Random-d.uk',
					url: 'https://random-d.uk/',
					reason: 'API',
					reasonURL: 'https://random-d.uk/api'
				}
			]
		});
	}

	async run(msg) {
		const { body } = await request.get('https://random-d.uk/api/v1/random');
		return msg.say({ files: [body.url] });
	}
};
