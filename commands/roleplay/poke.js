const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/argcQ0p.gif',
	'https://i.imgur.com/2QnSTJv.gif',
	'https://i.imgur.com/W5ooaKk.gif',
	'https://i.imgur.com/kpGGGie.gif',
	'https://i.imgur.com/d35YfMo.gif'
];

module.exports = class PokeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'poke',
			group: 'roleplay',
			memberName: 'poke',
			description: 'Pokes a user.',
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
			_**${msg.author.username}** pokes **${user.username}**._
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
