const Command = require('../../structures/Command');
const request = require('node-superfetch');
const url = require('url');
const validURL = require('valid-url');

module.exports = class IsItDownCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'is-it-down',
			aliases: ['website-down', 'web-down', 'site-down', 'is-down'],
			group: 'analyze',
			memberName: 'is-it-down',
			description: 'Determines if a website is down or not.',
			credit: [
				{
					name: 'Is It Down Right Now?',
					url: 'https://www.isitdownrightnow.com/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'site',
					prompt: 'What URL do you want to test?',
					type: 'string',
					validate: site => Boolean(validURL.isWebUri(site))
				}
			]
		});
	}

	async run(msg, { site }) {
		const parsed = url.parse(site);
		try {
			const { text } = await request
				.post('https://www.isitdownrightnow.com/check.php')
				.query({ domain: parsed.host });
			const down = text.includes('div class="statusdown"');
			if (!down) return msg.reply('👍 This site is up and running.');
			return msg.reply('👎 Looks like this site is down for everyone...');
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
