const Command = require('../../framework/Command');
const Leet = require('../../structures/Leet');

module.exports = class LeetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leet',
			aliases: ['l33t', 'leet-speak', 'l33t-speak', '1337', '1337-speak'],
			group: 'edit-text',
			description: 'Converts text to l33t speak.',
			credit: [
				{
					name: '1337.me',
					url: 'https://1337.me/',
					reason: 'Code'
				}
			],
			args: [
				{
					key: 'text',
					type: 'string',
					max: 500
				}
			]
		});
	}

	run(msg, { text }) {
		const leet = new Leet(text);
		return msg.say(leet.toLeet());
	}
};
