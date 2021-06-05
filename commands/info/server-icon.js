const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const { embedURL } = require('../../util/Util');
const displayFmts = {
	jpg: 'JPEG',
	png: 'PNG',
	gif: 'GIF',
	webp: 'WebP'
};

module.exports = class ServerIconCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'server-icon',
			aliases: ['guild-icon', 's-icon', 'g-icon'],
			group: 'info',
			memberName: 'server-icon',
			description: 'Responds with the server\'s icon.',
			guildOnly: true,
			clientPermissions: ['EMBED_LINKS']
		});
	}

	run(msg) {
		if (!msg.guild.icon) return msg.reply('This server has no icon.');
		const formats = ['png', 'jpg', 'webp'];
		const format = msg.guild.icon && msg.guild.icon.startsWith('a_') ? 'gif' : 'png';
		if (format === 'gif') formats.push('gif');
		const embed = new MessageEmbed()
			.setTitle(msg.guild.name)
			.setDescription(
				formats.map(fmt => embedURL(displayFmts[fmt], msg.guild.iconURL({ format: fmt, size: 2048 }))).join(' | ')
			)
			.setImage(msg.guild.iconURL({ format, size: 2048 }))
			.setColor(0x00AE86);
		return msg.embed(embed);
	}
};
