const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/988Y889.gif',
	'https://i.imgur.com/wxnNRmS.gif',
	'https://i.imgur.com/FDvkjzn.gif',
	'https://i.imgur.com/CkHHmd7.gif',
	'https://i.imgur.com/Wispo2E.gif'
];

module.exports = class TackleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tackle',
			aliases: ['glomp', 'tackle-hug'],
			group: 'roleplay',
			memberName: 'tackle',
			description: 'Tackles a user.',
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
			_**${msg.author.username}** tackles **${user.username}**._
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
