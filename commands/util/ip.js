const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class IpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ip',
			group: 'util',
			memberName: 'ip',
			description: 'Responds with the IP address Xiao\'s server is running on.',
			guarded: true,
			ownerOnly: true
		});
	}

	async run(msg) {
		const { body } = await request
			.get('https://api.ipify.org/')
			.query({ format: 'json' });
		return msg.say(body.ip);
	}
};
