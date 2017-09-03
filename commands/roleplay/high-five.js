const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://media.giphy.com/media/x58AS8I9DBRgA/giphy.gif',
	'https://i.imgur.com/W4cEKMy.gif',
	'https://i.imgur.com/r67Klvg.gif',
	'https://i.imgur.com/zi7D5X2.gif',
	'https://i.imgur.com/rJJWFj8.gif'
];

module.exports = class HighFivesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'high-five',
			group: 'roleplay',
			memberName: 'high-five',
			description: 'High Fives a user.',
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to roleplay with?',
					type: 'user'
				}
			]
		});
	}

	run(msg, args) {
		const { user } = args;
		return msg.say(stripIndents`
			**${msg.author.username}** *high-fives* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
