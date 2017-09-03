const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/IgvLWaa.gif',
	'https://i.imgur.com/ExSXiIP.gif',
	'https://i.imgur.com/z35hyC8.gif',
	'https://i.imgur.com/i9VAxiV.gif',
	'https://i.imgur.com/dvDwVom.gif'
];

module.exports = class BreakUpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'break-up',
			aliases: ['divorce'],
			group: 'roleplay',
			memberName: 'break-up',
			description: 'Breaks up with a user.',
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
			**${msg.author.username}** *breaks up with* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
