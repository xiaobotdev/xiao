const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class DonateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'donate',
			aliases: ['patreon'],
			group: 'util',
			memberName: 'donate',
			description: 'Responds with Xiao\'s Patreon donation link.',
			guarded: true
		});
	}

	run(msg) {
		return msg.say(stripIndents`
			Contribute to XiaoBot development!
			https://www.patreon.com/dragonfire535
			<https://paypal.me/dragonfire535>
		`);
	}
};
