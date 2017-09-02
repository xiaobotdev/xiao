const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');

module.exports = class SpoopyLinkCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'spoopy-link',
			group: 'random',
			memberName: 'spoopy-link',
			description: 'Checks if a link is spoopy or not.',
			args: [
				{
					key: 'site',
					prompt: 'What site do you think is spoopy?',
					type: 'string',
					parse: site => encodeURIComponent(site)
				}
			]
		});
	}

	async run(msg, args) {
		const { site } = args;
		if (/discord(\.gg|app\.com%2Finvite|\.me)%2F/gi.test(site)) return msg.say('Discord invites are safe!');
		try {
			const { body } = await snekfetch
				.get(`https://spoopy.link/api/${site}`);
			return msg.say(stripIndents`
				${body.safe ? 'This site is safe!' : 'This site may not be safe...'}
				${body.chain.map(url => `<${url.url}> [${url.safe ? 'SAFE' : `UNSAFE: ${url.reasons.join(', ')}`}]`).join('\n')}
			`);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
