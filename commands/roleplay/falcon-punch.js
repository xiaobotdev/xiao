const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/womEZVC.gif',
	'https://i.imgur.com/uw3S3hq.gif',
	'https://i.imgur.com/CVPT9ii.gif',
	'https://i.imgur.com/wGmUAIA.gif',
	'https://i.imgur.com/2HEhWdv.gif'
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

	run(msg, { user }) {
		return msg.say(stripIndents`
			**${msg.author.username}** *falcon punches* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
