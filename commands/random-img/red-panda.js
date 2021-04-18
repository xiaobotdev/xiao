const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class RedPandaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'red-panda',
			aliases: ['r-panda'],
			group: 'random-img',
			memberName: 'red-panda',
			description: 'Responds with a random red panda image.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'redpanda.pics',
					url: 'https://redpanda.pics/',
					reason: 'API',
					reasonURL: 'https://github.com/NexInfinite/redpandapics'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { body } = await request.get('https://redpanda.pics/random');
			return msg.say({ files: [body.url] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
