const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/vNEN1CC.gif',
	'https://i.imgur.com/iWC1ZLa.gif',
	'https://i.imgur.com/APxZpnT.gif',
	'https://i.imgur.com/uwbx4lE.gif',
	'https://i.imgur.com/p0AzUqV.gif'
];

module.exports = class PatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pat',
			group: 'roleplay',
			memberName: 'pat',
			description: 'Pats a user.',
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
			**${msg.author.username}** *pats* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
