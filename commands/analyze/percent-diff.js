const Command = require('../../framework/Command');
const wuzzy = require('wuzzy');

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
		const diff = wuzzy.jaccard(text1.toLowerCase(), text2.toLowerCase());
		return msg.reply(`${Math.round(diff * 100)}%`);
	}
};
