const Command = require('../../framework/Command');
const zalgo = require('../../assets/json/zalgo');

module.exports = class ZalgoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'zalgo',
			group: 'edit-text',
			memberName: 'zalgo',
			description: 'Converts text to zalgo.',
			credit: [
				{
					name: 'clux',
					url: 'https://github.com/clux',
					reason: 'Zalgo Character Data',
					reasonURL: 'https://github.com/clux/zalgolize/blob/master/zalgo.js#L3-L21'
				}
			],
			args: [
				{
					key: 'text',
					type: 'string',
					max: 200
				}
			]
		});
	}

	run(msg, { text }) {
		let result = '';
		for (let i = 0; i < text.length; i++) {
			result += text[i];
			for (const chars of Object.values(zalgo)) {
				let count = Math.floor(Math.random() * 5);
				while (count--) result += chars[Math.floor(Math.random() * chars.length)];
			}
		}
		return msg.say(result);
	}
};
