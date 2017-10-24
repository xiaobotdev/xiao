const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/bWJR9Ob.gif',
	'https://i.imgur.com/xW2p3BU.gif',
	'https://i.imgur.com/cMbUiPq.gif',
	'https://i.imgur.com/r1pvaH0.gif',
	'https://i.imgur.com/kWnkgI8.gif'
];

module.exports = class EvolveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'evolve',
			group: 'roleplay',
			memberName: 'evolve',
			description: 'Evolves a user.',
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
			_**${user.username}** is evolving!_
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
