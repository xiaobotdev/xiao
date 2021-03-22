const Command = require('../../structures/Command');
const { MessageEmbed, version: djsVersion } = require('discord.js');
const { version: commandoVersion } = require('discord.js-commando');
const moment = require('moment');
require('moment-duration-format');
const { formatNumber, embedURL } = require('../../util/Util');
const { version, dependencies, optionalDependencies } = require('../../package');
const deps = { ...dependencies, ...optionalDependencies };
const permissions = require('../../assets/json/permissions');
const copyright = require('../../assets/json/copyright');

module.exports = class InfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'info',
			aliases: ['stats', 'uptime', 'bot-info'],
			group: 'util-public',
			memberName: 'info',
			description: 'Responds with detailed bot information.',
			guarded: true,
			clientPermissions: ['EMBED_LINKS']
		});
	}

	async run(msg) {
		const invite = await this.client.generateInvite({ permissions });
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.setFooter(copyright.join('\n'))
			.addField('❯ Servers', formatNumber(this.client.guilds.cache.size), true)
			.addField('❯ Commands', formatNumber(this.client.registry.commands.size), true)
			.addField('❯ Shards', formatNumber(this.client.options.shardCount), true)
			.addField('❯ Home Server',
				this.client.options.invite ? embedURL('Invite', this.client.options.invite) : 'None', true)
			.addField('❯ Invite', embedURL('Add Me', invite), true)
			.addField('❯ Bot List',
				embedURL('discord.bots.gg', `https://discord.bots.gg/bots/${this.client.user.id}`), true)
			.addField('❯ Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
			.addField('❯ Uptime', moment.duration(this.client.uptime).format('d:hh:mm:ss'), true)
			.addField('❯ Version', `v${version}`, true)
			.addField('❯ Node.js', process.version, true)
			.addField('❯ Discord.js', `v${djsVersion}`, true)
			.addField('❯ Commando', `v${commandoVersion}`, true)
			.addField('❯ Dependencies', Object.keys(deps).sort().join(', '));
		return msg.embed(embed);
	}
};
