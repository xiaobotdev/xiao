const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/VmawTx2.gif',
	'https://i.imgur.com/63KDI7Z.gif',
	'https://i.imgur.com/MUwliFW.gif',
	'https://i.imgur.com/DXQ1WPq.gif',
	'https://i.imgur.com/VzhQN0F.gif'
];

module.exports = class FistBumpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fist-bump',
			group: 'roleplay',
			memberName: 'fist-bump',
			description: 'Fistbumps a user.',
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
			**${msg.author.username}** *fist-bumps* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
