const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/b4NeOXj.gif',
	'https://i.imgur.com/PnNkvCL.gif',
	'https://i.imgur.com/f6fojcB.gif',
	'https://i.imgur.com/JSoSkMV.gif',
	'https://i.imgur.com/TIEIBHW.gif'
];

module.exports = class InhaleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'inhale',
			group: 'roleplay',
			memberName: 'inhale',
			description: 'Inhales a user.',
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
			**${msg.author.username}** *inhales* **${user.username}** *but gained no ability...*
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
