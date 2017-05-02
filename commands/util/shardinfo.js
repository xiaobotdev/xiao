const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = class ShardInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'shardinfo',
            aliases: [
                'shard'
            ],
            group: 'util',
            memberName: 'shardinfo',
            description: 'Gives some bot info for the Shard you specify.',
            args: [
                {
                    key: 'shard',
                    prompt: 'Which Shard would you like to get data for?',
                    type: 'integer'
                }
            ]
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        const { shard } = args;
        if (shard > this.client.options.shardCount - 1 || shard < 0)
            return msg.say('The Shard ID is not valid.');
        const memory = await this.client.shard.broadcastEval('Math.round(process.memoryUsage().heapUsed / 1024 / 1024)');
        const uptime = await this.client.shard.fetchClientValues('uptime');
        const guilds = await this.client.shard.fetchClientValues('guilds.size');
        const embed = new RichEmbed()
            .setTitle(`Data for Shard ${shard}:`)
            .setColor(0x00AE86)
            .addField('Servers',
                guilds[shard], true)
            .addField('Memory Usage',
                `${memory[shard]}MB`, true)
            .addField('Uptime',
                moment.duration(uptime[shard]).format('d[d]h[h]m[m]s[s]'), true);
        return msg.embed(embed);
    }
};
