const Command = require('../../framework/Command');
const request = require('node-superfetch');
let parseDomain;
let ParseResultType;
import('parse-domain').then(loadedModule => {
	parseDomain = loadedModule.parseDomain;
	ParseResultType = loadedModule.ParseResultType;
});

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
					key: 'url',
					type: 'url'
				}
			]
		});
	}

	async run(msg, { url }) {
		const { type, domain, topLevelDomains } = parseDomain(url.hostname);
		if (type !== ParseResultType.Listed) return msg.reply('This domain is not supported.');
		const { text } = await request
			.post('https://www.isitdownrightnow.com/check.php')
			.query({ domain: `${domain}.${topLevelDomains.join('.')}` });
		const down = text.includes('div class="statusdown"');
		if (!down) return msg.reply('👍 This site is up and running.');
		return msg.reply('👎 Looks like this site is down for everyone...');
	}
};
