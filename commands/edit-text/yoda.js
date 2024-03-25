const Command = require('../../framework/Command');
const { firstUpperCase } = require('../../util/Util');
const pivots = ['is', 'be', 'will', 'show', 'do', 'try', 'are', 'teach', 'have', 'am'];
const ends = ['Hmmmmm.', 'Herh herh herh.', 'Yes, hmmm?'];

module.exports = class YodaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yoda',
			group: 'edit-text',
			memberName: 'yoda',
			description: 'Converts text to Yoda speak.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to convert to yoda speak?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(this.yodaSpeak(text));
	}

	yodaSpeak(text) {
		const sentences = text.split(/\?|!|\./);
		let newSentences = [];
		for (const sentence of sentences) {
			const trimmed = sentence.trim();
			const breaks = trimmed.split(',');
			const newBreaks = [];
			for (const broke of breaks) {
				const newText = [];
				const pivoted = [];
				const words = broke.split(' ');
				for (let i = 0; i < words.length; i++) {
					const clean = words[i].toLowerCase().replace(/[^a-z]/, '').trim();
					if (pivots.includes(clean)) {
						const fixed = newText.slice(i - 1);
						newText.splice(-i);
						pivoted.push(fixed, clean);
					} else {
						newText.push(clean);
					}
				}
				newBreaks.push(`${newText.join(' ').trim()} ${pivoted.join(' ').trim()}`);
			}
			newSentences.push(newBreaks.join(', ').trim());
		}
		newSentences = newSentences.map(sentence => {
			const split = sentence.split(' ');
			return split.map((word, i) => i === 0 || word === 'i' ? firstUpperCase(word) : word).join(' ');
		});
		return `${newSentences.join('. ').trim()} ${ends[Math.floor(Math.random() * ends.length)]}`;
	}
};
