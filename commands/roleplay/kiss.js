const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/S7mwPfE.gif',
	'https://i.imgur.com/ElvU78j.gif',
	'https://i.imgur.com/zW0GEA7.gif',
	'https://i.imgur.com/kbM8dzE.gif',
	'https://i.imgur.com/tQiFXDq.gif'
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

	run(msg, args) {
		const { user } = args;
		return msg.say(stripIndents`
			**${msg.author.username}** *kisses* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
