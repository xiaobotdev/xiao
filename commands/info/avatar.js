const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class AvatarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'avatar',
			aliases: ['profile-picture', 'profile-pic', 'pfp'],
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
		const formats = ['png'];
		if (user.avatar) formats.push('jpg', 'webp');
		const format = user.avatar && user.avatar.startsWith('a_') ? 'gif' : 'png';
		if (format === 'gif') formats.push('gif');
		const embed = new MessageEmbed()
			.setTitle(user.tag)
			.setDescription(
				formats.map(fmt => `[${fmt.toUpperCase()}](${user.displayAvatarURL({ format: fmt, size: 2048 })})`).join(' | ')
			)
			.setImage(user.displayAvatarURL({ format, size: 2048 }))
			.setColor(0x00AE86);
		return msg.embed(embed);
	}
};
