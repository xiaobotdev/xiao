const Command = require('../../structures/Command');
const { firstUpperCase } = require('../../util/Util');
const words = require('../../assets/json/lorem-ipsum');
const firstSentence = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet,', 'consectetur', 'adipiscing', 'elit'];

module.exports = class LoremIpsumCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lorem-ipsum',
			aliases: ['lorem', 'ipsum'],
			group: 'random-res',
			memberName: 'lorem-ipsum',
			description: 'Generates a randomized Lorem Ipsum placeholder text.',
			args: [
				{
					key: 'characters',
					prompt: 'How many characters do you want the text to be?',
					type: 'integer',
					min: 56,
					max: 2000
				}
			]
		});
	}

	run(msg, { characters }) {
		const result = [];
		let resultLength = 0;
		let firstSentenceIndex = 0;
		let currentSentenceWords = 0;
		let sentenceStart = true;
		while (resultLength < characters) {
			if (firstSentenceIndex === firstSentence.length) {
				const filterWords = words.filter(word => characters > resultLength + word.length + 1);
				if (!filterWords.length) {
					result[result.length - 1] = '.';
					for (let i = 0; i < characters - resultLength; i++) {
						const allowedI = [];
						result.forEach((item, j) => {
							if (result[j + 1] === '. ') return;
							if (result[j] === ' ') return;
							if (result[j] === '. ') return;
							if (j === result.length - 1) return;
							if (result[j].endsWith(',')) return;
							allowedI.push(j);
						});
						const chosenI = allowedI[Math.floor(Math.random() * allowedI.length)];
						const insertPoint = result[chosenI];
						result[chosenI] = `${insertPoint},`;
					}
					break;
				}
				const word = filterWords[Math.floor(Math.random() * filterWords.length)];
				result.push(sentenceStart ? firstUpperCase(word) : word);
				resultLength += word.length;
				currentSentenceWords++;
				if (currentSentenceWords > 0) sentenceStart = false;
			} else {
				const word = firstSentence[firstSentenceIndex];
				result.push(word);
				firstSentenceIndex++;
				currentSentenceWords++;
				resultLength += word.length;
				if (firstSentenceIndex > 0) sentenceStart = false;
			}
			if (currentSentenceWords === 8 || characters - resultLength === 1) {
				currentSentenceWords = 0;
				sentenceStart = true;
				result.push('. ');
				resultLength += 2;
			} else {
				result.push(' ');
				resultLength++;
			}
		}
		return msg.say(result.join(''));
	}
};
