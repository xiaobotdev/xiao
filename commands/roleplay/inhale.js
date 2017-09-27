const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const gifs = [
	'https://i.imgur.com/uUUk2kS.gif',
	'https://i.imgur.com/7C2v3yS.gif',
	'https://i.imgur.com/zsuMeQQ.gif',
	'https://i.imgur.com/kiqXxB6.gif',
	'https://i.imgur.com/0cK6zPg.gif'
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

	run(msg, { user }) {
		return msg.say(stripIndents`
			**${msg.author.username}** *inhales* **${user.username}** *but gained no ability...*
			${gifs[Math.floor(Math.random() * gifs.length)]}
		`);
	}
};
