const Command = require('../../structures/Command');
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
		const memory = await this.client.shard.broadcastEval('process.memoryUsage().heapUsed');
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.setFooter('©2017 dragonfire535#8081')
			.addField('❯ Servers',
				guilds.reduce((prev, val) => prev + val, 0), true)
			.addField('❯ Shards',
				this.client.options.shardCount, true)
			.addField('❯ Commands',
				this.client.registry.commands.size, true)
			.addField('❯ Source Code',
				'[View Here](https://github.com/dragonfire535/xiaobot)', true)
			.addField('❯ Memory Usage',
				`${Math.round(memory.reduce((prev, val) => prev + val, 0) / 1024 / 1024)}MB`, true)
			.addField('❯ Uptime',
				duration(this.client.uptime).format, true)
			.addField('❯ Version',
				`v${version}`, true)
			.addField('❯ Node Version',
				process.version, true)
			.addField('❯ Library',
				'[discord.js](https://discord.js.org)[-commando](https://github.com/Gawdl3y/discord.js-commando)', true);
		return msg.embed(embed);
	}
};
