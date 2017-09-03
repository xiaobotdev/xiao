const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/O7FQ5kz.gif',
	'https://i.imgur.com/LuWHflH.gif',
	'https://i.imgur.com/t87M9T9.gif',
	'https://i.imgur.com/W5qKOiU.gif',
	'https://i.imgur.com/vFQvAMk.gif'
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

	run(msg, args) {
		const { user } = args;
		return msg.say(stripIndents`
			**${msg.author.username}** *eats* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
