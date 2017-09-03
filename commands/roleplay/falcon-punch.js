const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/LOuK637.gif',
	'https://i.imgur.com/7nG6pDW.gif',
	'https://i.imgur.com/yxxSoFV.gif',
	'https://i.imgur.com/gC31YyP.gif',
	'https://i.imgur.com/RT0Qk0V.gif'
];

module.exports = class FalconPunchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'falcon-punch',
			group: 'roleplay',
			memberName: 'falcon-punch',
			description: 'Falcon Punches a user.',
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
			**${msg.author.username}** *falcon punches* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
