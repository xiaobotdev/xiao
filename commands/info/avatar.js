const Command = require('../../framework/Command');
const { EmbedBuilder } = require('discord.js');
const { embedURL } = require('../../util/Util');
const displayFmts = {
	jpg: 'JPEG',
	png: 'PNG',
	gif: 'GIF',
	webp: 'WebP'
};

module.exports = class AvatarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'avatar',
			aliases: ['profile-picture', 'profile-pic', 'pfp', 'av'],
			group: 'info',
			description: 'Responds with a user\'s avatar.',
			args: [
				{
					key: 'user',
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
		const embed = new EmbedBuilder()
			.setTitle(user.tag)
			.setDescription(
				formats.map(fmt => {
					const avatar = user.displayAvatarURL({ extension: fmt, size: 2048 });
					return embedURL(displayFmts[fmt], avatar);
				}).join(' | ')
			)
			.setImage(user.displayAvatarURL({ format, size: 2048 }))
			.setColor(0x00AE86);
		return msg.embed(embed);
	}
};
