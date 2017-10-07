const { Command } = require('discord.js-commando');

module.exports = class AvatarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'avatar',
			aliases: ['profile-picture', 'profile-pic'],
			group: 'other',
			memberName: 'avatar',
			description: 'Responds with a link to a user\'s avatar.',
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to get the avatar of?',
					type: 'user',
					default: ''
				}
			]
		});
	}

	run(msg, { user }) {
		if (!user) user = msg.author;
		if (!user.avatar) return msg.say('This user has no avatar.');
		const avatar = user.avatarURL({
			format: user.avatar.startsWith('a_') ? 'gif' : 'png',
			size: 2048
		});
		return msg.say(avatar);
	}
};
