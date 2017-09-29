const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/yb29pZP.gif',
	'https://i.imgur.com/uLL4nHN.gif',
	'https://i.imgur.com/4pWi9tx.gif',
	'https://i.imgur.com/2BiHTef.gif',
	'https://i.imgur.com/lSyjOHL.gif'
];

module.exports = class HugCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hug',
			group: 'roleplay',
			memberName: 'hug',
			description: 'Hugs a user.',
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
			**${msg.author.username}** *hugs* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
