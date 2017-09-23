const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/wXShFlF.gif',
	'https://i.imgur.com/bpBz27N.gif',
	'https://i.imgur.com/61vX6F6.gif',
	'https://i.imgur.com/6zv7HP5.gif',
	'https://i.imgur.com/ExYfGm8.gif'
];

module.exports = class TackleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tackle',
			aliases: ['glomp', 'tackle-hug'],
			group: 'roleplay',
			memberName: 'tackle',
			description: 'Tackles a user.',
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
			**${msg.author.username}** *tackles* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
