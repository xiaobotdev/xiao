const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { version, dependencies } = require('../../package');
const { duration } = require('../../util/Util');
const { XIAO_GITHUB_REPO_USERNAME, XIAO_GITHUB_REPO_NAME } = process.env;
const source = XIAO_GITHUB_REPO_NAME && XIAO_GITHUB_REPO_USERNAME;

module.exports = class InfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'info',
			aliases: ['information', 'stats'],
			group: 'util',
			memberName: 'info',
			description: 'Responds with detailed bot information.',
			guarded: true,
			clientPermissions: ['EMBED_LINKS']
		});
	}

	run(msg) {
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.setFooter('©2017-2018 dragonfire535#8081')
			.addField('❯ Servers', this.client.guilds.size, true)
			.addField('❯ Shards', this.client.options.shardCount, true)
			.addField('❯ Commands', this.client.registry.commands.size, true)
			.addField('❯ Home Server', this.client.options.invite ? `[Here](${this.client.options.invite})` : 'None', true)
			.addField('❯ Source Code',
				source ? `[Here](https://github.com/${XIAO_GITHUB_REPO_USERNAME}/${XIAO_GITHUB_REPO_NAME})` : 'N/A', true)
			.addField('❯ Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
			.addField('❯ Uptime', duration(this.client.uptime), true)
			.addField('❯ Version', `v${version}`, true)
			.addField('❯ Node Version', process.version, true)
			.addField('❯ Dependencies', Object.entries(dependencies).map(dep => this.parseDependency(dep)).join(', '));
		return msg.embed(embed);
	}

	parseDependency(dep) {
		if (dep[1].startsWith('github:')) {
			const repo = dep[1].replace('github:', '').split('/');
			return `[${dep[0]}](https://github.com/${repo[0]}/${repo[1].replace(/#.+/, '')})`;
		}
		return `[${dep[0]}](https://www.npmjs.com/package/${dep[0]})`;
	}
};
