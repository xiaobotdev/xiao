const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class HttpDuckCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'http-duck',
			group: 'search',
			memberName: 'http-duck',
			description: 'Responds with a duck for an HTTP status code.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Random-d.uk',
					url: 'https://random-d.uk/',
					reason: 'API',
					reasonURL: 'https://random-d.uk/http'
				}
			],
			args: [
				{
					key: 'code',
					prompt: 'What code do you want to get the duck of?',
					type: 'integer'
				}
			]
		});
	}

	async run(msg, { code }) {
		try {
			const { body } = await request.get(`https://random-d.uk/api/http/${code}.jpg`);
			return msg.say({ files: [{ attachment: body, name: `${code}.jpg` }] });
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
