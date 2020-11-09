const Command = require('../../structures/Command');
const words = require('../../assets/json/word-list');

module.exports = class AcrosticCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'acrostic',
			group: 'random-res',
			memberName: 'acrostic',
			description: 'Creates an acrostic from any word or name.',
			credit: [
				{
					name: 'Grady Ward',
					url: 'https://en.wikipedia.org/wiki/Grady_Ward',
					reason: 'Moby Word Lists',
					reasonURL: 'http://www.gutenberg.org/ebooks/3201'
				}
			],
			args: [
				{
					key: 'word',
					prompt: 'What word do you want to use to generate the acrostic? Only letters and spaces.',
					type: 'string',
					max: 20,
					validate: word => {
						if (/^[A-Z ]+$/i.test(word)) return true;
						return 'Please enter a valid word. Only letters and spaces are allowed.';
					},
					parse: word => word.toLowerCase().split('')
				}
			]
		});
	}

	run(msg, { word }) {
		const results = [];
		for (const letter of word) {
			if (letter === ' ') {
				results.push(' ');
				continue;
			}
			const filteredWords = words.filter(wrd => wrd.startsWith(letter.toLowerCase()));
			const chosen = filteredWords[Math.floor(Math.random() * filteredWords.length)];
			results.push(`**${letter.toUpperCase()}**${chosen.slice(1)}`);
		}
		return msg.say(results.join('\n'));
	}
};
