const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { version } = require('../../package');
const { GOOGLE_KEY } = process.env;

module.exports = class SafeUrlCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'safe-url',
			aliases: ['check-url', 'safe-browsing', 'virus', 'safe-link', 'check-link', 'spoopy-link'],
			group: 'analyze',
			memberName: 'safe-url',
			description: 'Determines if a URL is safe or not.',
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Safe Browsing API',
					reasonURL: 'https://developers.google.com/safe-browsing/'
				}
			],
			args: [
				{
					key: 'url',
					prompt: 'What URL do you want to test?',
					type: 'url'
				}
			]
		});
	}

	async run(msg, { url }) {
		try {
			const { body } = await request
				.post('https://safebrowsing.googleapis.com/v4/threatMatches:find')
				.query({ key: GOOGLE_KEY })
				.send({
					client: {
						clientId: 'xiao-discord',
						clientVersion: version
					},
					threatInfo: {
						threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
						platformTypes: ['ANY_PLATFORM'],
						threatEntryTypes: ['URL'],
						threatEntries: [{ url }]
					}
				});
			if (!body.matches) return msg.reply(`👍 Good to go! This link is safe!`);
			return msg.reply('⚠️ This link is unsafe! **Do not click it!** ⚠️');
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
