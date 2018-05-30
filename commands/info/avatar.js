const Command = require('../../structures/Command');

module.exports = class AvatarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'avatar',
			aliases: ['profile-picture', 'profile-pic'],
			group: 'info',
			memberName: 'avatar',
			description: 'Responds with a user\'s avatar.',
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to get the avatar of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
		const format = user.avatar && user.avatar.startsWith('a_') ? 'gif' : 'png';
		return msg.say(user.displayAvatarURL({ format, size: 2048 }));
	}
};
