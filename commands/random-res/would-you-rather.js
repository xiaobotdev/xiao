const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');

module.exports = class WouldYouRatherCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'would-you-rather',
			aliases: ['wy-rather'],
			group: 'random-res',
			memberName: 'would-you-rather',
			description: 'Responds with a random would you rather question.',
			clientPermissions: ['EMBED_LINKS']
		});
	}

	async run(msg) {
		try {
			const { body } = await snekfetch
				.get('http://www.rrrather.com/botapi');
			return msg.say(stripIndents`
				${body.title}...
				${body.choicea} OR ${body.choiceb}?
			`);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
