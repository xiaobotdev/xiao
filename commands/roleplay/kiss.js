const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/Omge3Sb.gif',
	'https://i.imgur.com/KbfdOol.gif',
	'https://i.imgur.com/mWJAkhD.gif',
	'https://i.imgur.com/14j8ZkP.gif',
	'https://i.imgur.com/IXx6GyJ.gif'
];

module.exports = class KissCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kiss',
			group: 'roleplay',
			memberName: 'kiss',
			description: 'Kisses a user.',
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
			**${msg.author.username}** *kisses* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
