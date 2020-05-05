const Command = require('../../structures/Command');
const { MessageEmbed, version: djsVersion } = require('discord.js');
const { version: commandoVersion } = require('discord.js-commando');
const moment = require('moment');
require('moment-duration-format');
const { formatNumber, embedURL } = require('../../util/Util');
const { version, dependencies } = require('../../package');
const permissions = require('../../assets/json/permissions');
const { XIAO_GITHUB_REPO_USERNAME, XIAO_GITHUB_REPO_NAME } = process.env;
const source = XIAO_GITHUB_REPO_NAME && XIAO_GITHUB_REPO_USERNAME;

module.exports = class InfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'info',
			aliases: ['stats', 'uptime'],
			group: 'util',
			memberName: 'info',
			description: 'Responds with detailed bot information.',
			guarded: true,
			clientPermissions: ['EMBED_LINKS']
		});
	}

	async run(msg) {
		const invite = await this.client.generateInvite(permissions);
		const repoURL = `https://github.com/${XIAO_GITHUB_REPO_USERNAME}/${XIAO_GITHUB_REPO_NAME}`;
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.setFooter('©2017-2020 dragonfire535#8081')
			.addField('❯ Servers', formatNumber(this.client.guilds.cache.size), true)
			.addField('❯ Commands', formatNumber(this.client.registry.commands.size), true)
			.addField('❯ Shards', formatNumber(this.client.options.shardCount), true)
			.addField('❯ Home Server',
				this.client.options.invite ? embedURL('Invite', this.client.options.invite) : 'None', true)
			.addField('❯ Invite', embedURL('Add Me', invite), true)
			.addField('❯ Source Code', source ? embedURL('GitHub', repoURL) : 'N/A', true)
			.addField('❯ Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
			.addField('❯ Uptime', moment.duration(this.client.uptime).format('d:hh:mm:ss'), true)
			.addField('❯ Version', `v${version}`, true)
			.addField('❯ Node.js', process.version, true)
			.addField('❯ Discord.js', `v${djsVersion}`, true)
			.addField('❯ Commando', `v${commandoVersion}`, true)
			.addField('❯ Dependencies', this.parseDependencies(dependencies));
		return msg.embed(embed);
	}

	parseDependencies(deps) {
		return Object.keys(deps).map(dep => `[${dep}](https://npmjs.com/${dep})`).join(', ');
	}
};
