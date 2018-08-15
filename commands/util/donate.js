const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class DonateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'donate',
			aliases: ['patreon', 'paypal'],
			group: 'util',
			memberName: 'donate',
			description: 'Responds with the bot\'s donation links.',
			guarded: true
		});
	}

	run(msg) {
		return msg.say(stripIndents`
			Contribute to development!
			<https://www.patreon.com/dragonfire535>
			<https://paypal.me/dragonfire535>
		`);
	}
};
