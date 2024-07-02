const Command = require('../../framework/Command');
const { EmbedBuilder, version: djsVersion, PermissionFlagsBits } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const os = require('os');
const { formatNumber, embedURL } = require('../../util/Util');
const { version } = require('../../package');
const copyright = require('../../assets/json/copyright');

module.exports = class InfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'info',
			aliases: ['stats', 'uptime', 'prefix', 'invite'],
			group: 'util-public',
			description: 'Responds with detailed bot information.',
			guarded: true,
			clientPermissions: [PermissionFlagsBits.EmbedLinks]
		});
	}

	run(msg) {
		const invite = this.client.generateInvite({ permissions: [PermissionFlagsBits.Administrator], scopes: ['bot'] });
		const prefix = msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix;
		const embed = new EmbedBuilder()
			.setColor(0x00AE86)
			.setFooter({ text: copyright.join('\n') })
			.addField('❯ Servers', formatNumber(this.client.guilds.cache.size), true)
			.addField('❯ Commands', formatNumber(this.client.registry.commands.size), true)
			.addField('❯ Total Usage', formatNumber(this.client.registry.totalUses), true)
			.addField('❯ Home Server',
				this.client.options.invite ? embedURL('Invite', this.client.options.invite) : 'None', true)
			.addField('❯ Invite', embedURL('Add Me', invite), true)
			.addField('❯ Prefix', prefix || 'None', true)
			.addField('❯ Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
			.addField('❯ Uptime', moment.duration(this.client.uptime).format('d:hh:mm:ss'), true)
			.addField('❯ Version', `v${version}`, true)
			.addField('❯ Node.js', process.version, true)
			.addField('❯ Discord.js', `v${djsVersion}`, true)
			.addField('❯ OS', os.platform(), true);
		return msg.embed(embed);
	}
};
