const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/ihGcwnE.gif',
	'https://i.imgur.com/urpt2DJ.gif',
	'https://i.imgur.com/GbWuvMe.gif',
	'https://i.imgur.com/Txc5SoK.gif',
	'https://i.imgur.com/pzUmHEm.gif'
];

module.exports = class PunchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'punch',
			group: 'roleplay',
			memberName: 'punch',
			description: 'Punches a user.',
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
			_**${msg.author.username}** punches **${user.username}**._
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
