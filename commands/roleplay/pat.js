const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/oynHZmT.gif',
	'https://i.imgur.com/qcZiv4W.gif',
	'https://i.imgur.com/aAvI3Cq.gif',
	'https://i.imgur.com/DJ6iTRW.gif',
	'https://i.imgur.com/whDGqSu.gif'
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

	run(msg, args) {
		const { user } = args;
		return msg.say(stripIndents`
			**${msg.author.username}** *pats* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
