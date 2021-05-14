const Command = require('../../structures/Command');
const stringSimilarity = require('string-similarity');

module.exports = class PercentDiffCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'percent-diff',
			aliases: ['name-diff'],
			group: 'analyze',
			memberName: 'percent-diff',
			description: 'Determines the percentage of difference between two strings.',
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
		const diff = stringSimilarity.compareTwoStrings(text1, text2);
		return msg.reply(`${Math.round(diff * 100)}%`);
	}
};
