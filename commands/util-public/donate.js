const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class DonateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'donate',
			aliases: ['paypal', 'patreon'],
			group: 'util-public',
			memberName: 'donate',
			description: 'Responds with the bot\'s donation links.',
			guarded: true,
			credit: [
				{
					name: 'PayPal',
					url: 'https://www.paypal.com/us/home',
					reason: 'Donation Gathering'
				},
				{
					name: 'Patreon',
					url: 'https://www.patreon.com/',
					reason: 'Donation Gathering'
				}
			]
		});
	}

	run(msg) {
		return msg.say(stripIndents`
			Contribute to development!
			<https://www.patreon.com/xiaodiscord>
			<https://paypal.me/dragonfire535>
		`);
	}
};
