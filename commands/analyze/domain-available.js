const Command = require('../../framework/Command');
const request = require('node-superfetch');
import { parseDomain, ParseResultType } from 'parse-domain';
const { GODADDY_KEY, GODADDY_SECRET } = process.env;

module.exports = class DomainAvailableCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'domain-available',
			aliases: ['domain', 'buy-domain'],
			group: 'analyze',
			memberName: 'domain-available',
			description: 'Determines if a domain is available for purchase.',
			credit: [
				{
					name: 'GoDaddy',
					url: 'https://www.godaddy.com/',
					reason: 'API',
					reasonURL: 'https://developer.godaddy.com/'
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
		const { type, domain, topLevelDomains } = parseDomain(url.hostname);
		if (type !== ParseResultType.Listed) return msg.reply('This domain is not supported.');
		try {
			const { body } = await request
				.get('https://api.godaddy.com/v1/domains/available')
				.set({ Authorization: `sso-key ${GODADDY_KEY}:${GODADDY_SECRET}` })
				.query({
					domain: `${domain}.${topLevelDomains.join('.')}`,
					checkType: 'FAST',
					forTransfer: false
				});
			if (!body.definitive) return msg.reply('❔ This domain might be available, but I\'m not sure.');
			if (body.available) return msg.reply('👍 This domain is available.');
			return msg.reply('👎 This domain is taken.');
		} catch (err) {
			if (err.status === 422) return msg.reply('This domain is not supported.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
