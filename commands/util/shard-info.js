const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { duration } = require('../../structures/Util');

module.exports = class ShardInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shard-info',
			aliases: ['shard', 'shard-stats'],
			group: 'util',
			memberName: 'shard-info',
			description: 'Responds with detailed information for a specific Shard.',
			guarded: true,
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'shard',
					prompt: 'Which Shard would you like to get data for?',
					type: 'integer',
					default: '',
					validate: shard => {
						if (shard < this.client.options.shardCount && shard > -1) return true;
						return 'Invalid Shard ID.';
					}
				}
			]
		});
	}

	async run(msg, { shard }) {
		if (!shard && shard !== 0) shard = this.client.shard.id;
		const uptime = await this.client.shard.fetchClientValues('uptime');
		const guilds = await this.client.shard.fetchClientValues('guilds.size');
		const users = await this.client.shard.fetchClientValues('users.size');
		const embed = new MessageEmbed()
			.setTitle(`Shard ${shard}`)
			.setColor(0x00AE86)
			.addField('❯ Servers',
				guilds[shard], true)
			.addField('❯ Users',
				users[shard], true)
			.addField('❯ Uptime',
				duration(uptime[shard]).format(), true);
		return msg.embed(embed);
	}
};
