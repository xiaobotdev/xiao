const Command = require('../../structures/Command');
const zalgo = require('../../assets/json/zalgo');

module.exports = class ZalgoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'zalgo',
			aliases: ['zalgolize'],
			group: 'text-edit',
			memberName: 'zalgo',
			description: 'Converts text to zalgo.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to convert to zalgo?',
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
