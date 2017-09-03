const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/gkdDk4P.gif',
	'https://i.imgur.com/BjFCGGx.gif',
	'https://i.imgur.com/XJkJ9UR.gif',
	'https://i.imgur.com/H2XpKr6.gif',
	'https://i.imgur.com/McM6VYZ.gif'
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

	run(msg, args) {
		const { user } = args;
		return msg.say(stripIndents`
			**${user.username}** *is evolving!*
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
