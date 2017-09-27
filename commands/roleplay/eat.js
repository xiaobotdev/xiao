const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/lQVyPgp.gif',
	'https://i.imgur.com/rWal7zB.gif',
	'https://i.imgur.com/DjURkgJ.gif',
	'https://i.imgur.com/NDvu9Ga.gif',
	'https://i.imgur.com/DAmSe54.gif'
];

module.exports = class EatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'eat',
			group: 'roleplay',
			memberName: 'eat',
			description: 'Eats a user.',
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
			**${msg.author.username}** *eats* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
