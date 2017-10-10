const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { version } = require('../../package');
const { duration } = require('../../structures/Util');

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

	async run(msg) {
		const guilds = await this.client.shard.fetchClientValues('guilds.size');
		const invite = await this.client.generateInvite('1345846343');
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.setFooter('©2017 dragonfire535#8081')
			.addField('❯ Servers',
				guilds.reduce((prev, val) => prev + val, 0), true)
			.addField('❯ Home Server',
				`[Here](https://${this.client.options.invite})`, true)
			.addField('❯ Invite',
				`[Here](${invite})`, true)
			.addField('❯ Shards',
				this.client.options.shardCount, true)
			.addField('❯ Commands',
				this.client.registry.commands.size, true)
			.addField('❯ Uptime',
				duration(this.client.uptime).format(), true)
			.addField('❯ Version',
				`v${version}`, true)
			.addField('❯ Node Version',
				process.version, true)
			.addField('❯ Library',
				'[discord.js](https://discord.js.org)[-commando](https://github.com/Gawdl3y/discord.js-commando)', true);
		return msg.embed(embed);
	}
};
