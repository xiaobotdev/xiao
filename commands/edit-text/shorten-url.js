const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { BITLY_KEY } = process.env;

module.exports = class ShortenUrlCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shorten-url',
			aliases: ['short-url', 'bit-ly', 'bit.ly', 'url-shorten', 'url-short'],
			group: 'edit-text',
			memberName: 'shorten-url',
			description: 'Shortens a URL using bit.ly.',
			credit: [
				{
					name: 'Bitly',
					url: 'https://bitly.com/',
					reason: 'API',
					reasonURL: 'https://dev.bitly.com/v4_documentation.html'
				}
			],
			args: [
				{
					key: 'url',
					prompt: 'What url would you like to shorten?',
					type: 'string',
					validate: url => {
						if (encodeURI(url).length > 2083) return 'Your URL is too long.';
						return true;
					}
				}
			]
		});
	}

	async run(msg, { url }) {
		try {
			const { body } = await request
				.post('https://api-ssl.bitly.com/v4/shorten')
				.send({ long_url: url })
				.set({ Authorization: `Bearer ${BITLY_KEY}` });
			return msg.say(body.link);
		} catch (err) {
			if (err.status === 400) return msg.reply('You provided an invalid URL. Please try again.');
			throw err;
		}
	}
};
