const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const filterLevels = ['Off', 'No Role', 'Everyone'];
const verificationLevels = ['None', 'Low', 'Medium', '(╯°□°）╯︵ ┻━┻', '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'];

module.exports = class GuildInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'server-info',
			aliases: ['guild', 'server', 'guild-info'],
			group: 'guild-info',
			memberName: 'server-info',
			description: 'Responds with detailed information on the server.',
			guildOnly: true,
			clientPermissions: ['EMBED_LINKS']
		});
	}

	run(msg) {
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.setThumbnail(msg.guild.iconURL())
			.addField('❯ Name',
				msg.guild.name, true)
			.addField('❯ ID',
				msg.guild.id, true)
			.addField('❯ Creation Date',
				msg.guild.createdAt.toDateString(), true)
			.addField('❯ Region',
				msg.guild.region, true)
			.addField('❯ Explicit Filter',
				filterLevels[msg.guild.explicitContentFilter], true)
			.addField('❯ Verification Level',
				verificationLevels[msg.guild.verificationLevel], true)
			.addField('❯ Owner',
				msg.guild.owner ? msg.guild.owner.user.username : 'None', true)
			.addField('❯ Members',
				msg.guild.memberCount, true);
		return msg.embed(embed);
	}
};
