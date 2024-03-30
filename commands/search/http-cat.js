const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class HttpCatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'http-cat',
			group: 'search',
			memberName: 'http-cat',
			description: 'Responds with a cat for an HTTP status code.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'HTTP Cats',
					url: 'https://http.cat/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'code',
					type: 'integer'
				}
			]
		});
	}

	async run(msg, { code }) {
		try {
			const { body, headers } = await request.get(`https://http.cat/${code}`);
			if (headers['content-type'].includes('text/html')) return msg.say('Could not find any results.');
			return msg.say({ files: [{ attachment: body, name: `${code}.jpg` }] });
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			throw err;
		}
	}
};
