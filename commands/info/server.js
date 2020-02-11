const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const filterLevels = ['Off', 'No Role', 'Everyone'];
const verificationLevels = ['None', 'Low', 'Medium', '(╯°□°）╯︵ ┻━┻', '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'];

module.exports = class ServerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'server',
			aliases: ['guild', 'server-info', 'guild-info'],
			group: 'info',
			memberName: 'server',
			description: 'Responds with detailed information on the server.',
			guildOnly: true,
			clientPermissions: ['EMBED_LINKS']
		});
	}

	async run(msg) {
		if (!msg.guild.members.cache.has(msg.guild.ownerID)) await msg.guild.members.fetch(msg.guild.ownerID);
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.setThumbnail(msg.guild.iconURL({ format: 'png' }))
			.setAuthor(msg.guild.name)
			.setDescription(stripIndents`
				**General Info:**
				• ID: ${msg.guild.id}
				• Owner: ${msg.guild.owner.user.tag}
				• Region: ${msg.guild.region.toUpperCase()}
				• Creation Date: ${moment.utc(msg.guild.createdAt).format('MM/DD/YYYY h:mm A')}
				• Explicit Filter: ${filterLevels[msg.guild.explicitContentFilter]}
				• Verification Level: ${verificationLevels[msg.guild.verificationLevel]}

				**Server Stats:**
				• Members: ${msg.guild.memberCount}
				• Roles: ${msg.guild.roles.cache.size}
				• Channels: ${msg.guild.channels.cache.filter(channel => channel.type !== 'category').size}
			`);
		return msg.embed(embed);
	}
};
