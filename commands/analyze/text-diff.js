const Command = require('../../framework/Command');
const Diff = require('text-diff');
const wuzzy = require('wuzzy');

module.exports = class TextDiffCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'text-diff',
			aliases: ['diff', 'percent-diff', 'name-diff'],
			group: 'analyze',
			memberName: 'text-diff',
			description: 'Compares two different bits of text.',
			args: [
				{
					key: 'text1',
					type: 'string'
				},
				{
					key: 'text2',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text1, text2 }) {
		const diff = new Diff();
		const textDiff = diff.main(text1, text2);
		const wuzzyDiff = wuzzy.jaccard(text1.toLowerCase(), text2.toLowerCase());
		diff.cleanupSemantic(textDiff);
		const formatted = textDiff.map(change => {
			if (change[0] === 1) return `**${change[1]}**`;
			if (change[0] === 0) return change[1];
			if (change[0] === -1) return `~~${change[1]}~~`;
			return '';
		}).join('');
		return msg.reply(`${formatted} (${Math.round(wuzzyDiff * 100)}% similarity)`);
	}
};
