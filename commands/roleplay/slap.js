const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/bNw8icN.gif',
	'https://i.imgur.com/wvQZQSs.gif',
	'https://i.imgur.com/ib0G51r.gif',
	'https://i.imgur.com/y7zW1gc.gif',
	'https://i.imgur.com/vHRiZDg.gif'
];

module.exports = class SlapCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'slap',
			group: 'roleplay',
			memberName: 'slap',
			description: 'Slaps a user.',
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
			**${msg.author.username}** *slaps* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
