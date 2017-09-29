const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/JbkXFWy.gif',
	'https://i.imgur.com/LEVJfhI.gif',
	'https://i.imgur.com/WaJDnnS.gif',
	'https://i.imgur.com/wu4Xkpg.gif',
	'https://i.imgur.com/yAqf997.gif'
];

module.exports = class CuddleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cuddle',
			group: 'roleplay',
			memberName: 'cuddle',
			description: 'Cuddles a user.',
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
			**${msg.author.username}** *cuddles* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
