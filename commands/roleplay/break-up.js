const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/1e6QRWk.gif',
	'https://i.imgur.com/hyteoA9.gif',
	'https://i.imgur.com/wT6357t.gif',
	'https://i.imgur.com/gyewxtI.gif',
	'https://i.imgur.com/rjcbrWc.gif'
];

module.exports = class BreakUpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'break-up',
			aliases: ['divorce'],
			group: 'roleplay',
			memberName: 'break-up',
			description: 'Breaks up with a user.',
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
			**${msg.author.username}** *breaks up with* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
