const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');

module.exports = class ShibaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shiba',
			aliases: ['shiba-inu', 'shibe', 'shibe-inu', 'doge'],
			group: 'random-img',
			memberName: 'shiba',
			description: 'Responds with a random image of a Shiba Inu.',
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'shibe.online',
					url: 'https://shibe.online/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const { body } = await request
			.get('https://shibe.online/api/shibes')
			.query({
				count: 1,
				urls: true,
				httpsUrls: true
			});
		return msg.say({ files: [body[0]] });
	}
};
