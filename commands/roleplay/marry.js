const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/uz4k1qI.gif',
	'https://i.imgur.com/jSlUKbw.gif',
	'https://i.imgur.com/4LMEw0M.gif',
	'https://i.imgur.com/BbXQqn1.gif'
];

module.exports = class MarryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'marry',
			group: 'roleplay',
			memberName: 'marry',
			description: 'Marries a user.',
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
			**${msg.author.username}** *marries* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
