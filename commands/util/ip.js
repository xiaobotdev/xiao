const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class IpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ip',
			group: 'util',
			memberName: 'ip',
			description: 'Responds with the IP address the bot\'s server is running on.',
			details: 'Only the bot owner(s) may use this command.',
			guarded: true,
			ownerOnly: true,
			credit: [
				{
					name: 'ipify API',
					url: 'https://www.ipify.org/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const { body } = await request
			.get('https://api.ipify.org/')
			.query({ format: 'json' });
		return msg.say(body.ip);
	}
};
