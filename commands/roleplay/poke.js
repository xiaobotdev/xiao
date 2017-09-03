const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/XMuJ7K8.gif',
	'https://i.imgur.com/mewvEFw.gif',
	'https://i.imgur.com/RKGafME.gif',
	'https://i.imgur.com/pqgsmX1.gif',
	'https://i.imgur.com/Ez67xSU.gif'
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

	run(msg, args) {
		const { user } = args;
		return msg.say(stripIndents`
			**${msg.author.username}** *pokes* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
