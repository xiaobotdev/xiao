const Command = require('../../framework/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const { formatNumber } = require('../../util/Util');
const filterLevels = {
	DISABLED: 'Off',
	MEMBERS_WITHOUT_ROLES: 'No Role',
	ALL_MEMBERS: 'Everyone'
};
const verificationLevels = {
	NONE: 'None',
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: 'High',
	VERY_HIGH: 'Highest'
};

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
		const owner = await msg.guild.fetchOwner();
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.setThumbnail(msg.guild.iconURL({ format: 'png' }))
			.addField('❯ Name', msg.guild.name, true)
			.addField('❯ ID', msg.guild.id, true)
			.addField('❯ Creation Date', moment.utc(msg.guild.createdAt).format('MM/DD/YYYY h:mm A'), true)
			.addField('❯ Owner', owner.user.tag, true)
			.addField('❯ Boost Count', formatNumber(msg.guild.premiumSubscriptionCount || 0), true)
			.addField('❯ Boost Tier', msg.guild.premiumTier ? `Tier ${msg.guild.premiumTier}` : 'None', true)
			.addField('❯ Region', msg.guild.region.toUpperCase(), true)
			.addField('❯ Explicit Filter', filterLevels[msg.guild.explicitContentFilter], true)
			.addField('❯ Verification Level', verificationLevels[msg.guild.verificationLevel], true)
			.addField('❯ Members', formatNumber(msg.guild.memberCount), true)
			.addField('❯ Roles', formatNumber(msg.guild.roles.cache.size), true)
			.addField('❯ Channels',
				formatNumber(msg.guild.channels.cache.filter(channel => channel.type !== 'category').size), true);
		return msg.embed(embed);
	}
};
