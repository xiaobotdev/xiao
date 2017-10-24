const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/YvbhAML.gif',
	'https://i.imgur.com/LOWtASy.gif',
	'https://i.imgur.com/LgtJwPW.gif',
	'https://i.imgur.com/GuLDF6b.gif',
	'https://i.imgur.com/2DdIR5H.gif'
];

module.exports = class HighFiveCommand extends Command {
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

	run(msg, { user }) {
		return msg.say(stripIndents`
			_**${msg.author.username}** high-fives **${user.username}**._
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
