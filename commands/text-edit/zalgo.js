const { Command } = require('discord.js-commando');
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
					validate: text => {
						if (text.length < 500) return true;
						return 'Invalid text, please keep the text under 500 characters.';
					}
				}
			]
		});
	}

	run(msg, { text }) {
		let result = '';
		for (let i = 0; i < text.length; i++) {
			result += text[i];
			if (text[i].length > 1) continue;
			const counts = {
				up: Math.floor(Math.random() * 8) + 1,
				middle: Math.floor(Math.random() * 3),
				down: Math.floor(Math.random() * 8) + 1
			};
			for (const type of Object.keys(counts)) {
				const count = counts[type];
				const chars = zalgo[type];
				while (count--) result += chars[Math.floor(Math.random() * chars.length)];
			}
		}
		return msg.say(result);
	}
};
