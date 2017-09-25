const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class DonateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'donate',
			aliases: ['patreon', 'paypal', 'ko-fi'],
			group: 'util',
			memberName: 'donate',
			description: 'Responds with Xiao\'s donation links.',
			guarded: true
		});
	}

	run(msg) {
		return msg.say(stripIndents`
			Contribute to XiaoBot development!
			<https://www.patreon.com/dragonfire535>
			<https://paypal.me/dragonfire535>
			<https://ko-fi.com/dragonfire>
		`);
	}
};
