const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const answers = require('../../assets/json/magic-conch');

module.exports = class MagicConchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'magic-conch',
			aliases: ['magic-conch-shell', 'conch'],
			group: 'random-res',
			description: 'Asks your question to the Magic Conch.',
			credit: [
				{
					name: 'Nickelodeon',
					url: 'https://www.nick.com/',
					reason: 'Original "Spongebob Squarepants" Show',
					reasonURL: 'https://www.nick.com/shows/spongebob-squarepants'
				}
			],
			args: [
				{
					key: 'question',
					type: 'string',
					max: 1950
				}
			]
		});
	}

	run(msg, { question }) {
		return msg.say(stripIndents`
			_${question}_
			🐚 ${answers[Math.floor(Math.random() * answers.length)]} 🐚
		`);
	}
};
