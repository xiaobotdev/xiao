const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/WKj10Dc.gif',
	'https://i.imgur.com/pOIxkab.gif',
	'https://i.imgur.com/XvNOY3B.gif',
	'https://i.imgur.com/ai4cne0.gif',
	'https://i.imgur.com/Tg8tGny.gif'
];

module.exports = class PunchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'punch',
			group: 'roleplay',
			memberName: 'punch',
			description: 'Punches a user.',
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
			**${msg.author.username}** *punches* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
