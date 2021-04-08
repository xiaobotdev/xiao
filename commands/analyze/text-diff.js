const Command = require('../../structures/Command');
const Diff = require('text-diff');

module.exports = class TextDiffCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'text-diff',
			aliases: ['diff'],
			group: 'analyze',
			memberName: 'text-diff',
			description: 'Compares two different bits of text.',
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
		const diff = new Diff();
		const textDiff = diff.main(text1, text2);
		diff.cleanupSemantic(textDiff);
		const formatted = textDiff.map(change => {
			if (change[0] === 1) return `**${change[1]}**`;
			if (change[0] === 0) return change[1];
			if (change[0] === -1) return `~~${change[1]}~~`;
			return '';
		}).join('');
		return msg.reply(formatted);
	}
};
