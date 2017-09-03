const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/rfy8z2K.gif',
	'https://i.imgur.com/FsygXIT.gif',
	'https://i.imgur.com/8sbR33w.gif',
	'https://i.imgur.com/wsIpwcT.gif',
	'https://i.imgur.com/mAV8aa7.gif'
];

module.exports = class SlapCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'slap',
			group: 'roleplay',
			memberName: 'slap',
			description: 'Slaps a user.',
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
			**${msg.author.username}** *slaps* **${user.username}**
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
