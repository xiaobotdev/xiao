const Command = require('../../structures/Command');
const leven = require('leven');

module.exports = class PercentDiffCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'percent-diff',
			aliases: ['name-diff', 'leven-diff', 'levenshtein-diff'],
			group: 'analyze',
			memberName: 'percent-diff',
			description: 'Determines the percentage between two strings.',
			args: [
				{
					key: 'text1',
					prompt: 'What is the first text you would like to compare?',
					type: 'string'
				},
				{
					key: 'text2',
					prompt: 'What is the second text you would like to compare?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text1, text2 }) {
		const distance = leven(text1, text2);
		const bigger = Math.max(text1.length, text2.length);
		const diff = Math.round(((bigger - distance) / bigger) * 100);
		return msg.reply(`${diff}%`);
	}
};
