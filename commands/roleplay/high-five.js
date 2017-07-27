const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class HighFivesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'high-five',
			group: 'roleplay',
			memberName: 'high-five',
			description: 'High Fives a user.',
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
			**${msg.author.username}** *high-fives* **${user.username}**
			https://media.giphy.com/media/x58AS8I9DBRgA/giphy.gif
		`);
	}
};
