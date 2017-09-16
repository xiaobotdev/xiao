const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/mpi3pwu.gif',
	'https://i.imgur.com/0yAIWbg.gif',
	'https://i.imgur.com/xQPBSIs.gif',
	'https://i.imgur.com/O4K8Bj4.gif',
	'https://i.imgur.com/eBWR5vJ.gif'
];

module.exports = class CuddleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cuddle',
			group: 'roleplay',
			memberName: 'cuddle',
			description: 'Cuddles a user.',
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
			**${msg.author.username}** *cuddles* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
