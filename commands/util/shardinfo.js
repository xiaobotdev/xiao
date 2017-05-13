const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = class ShardInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'shard-info',
            aliases: ['shard'],
            group: 'util',
            memberName: 'shard-info',
            description: 'Gives some bot info for the Shard you specify.',
            args: [
                {
                    key: 'shard',
                    prompt: 'Which Shard would you like to get data for?',
                    type: 'integer',
                    validate: shard => {
                        if (shard < this.client.options.shardCount && shard > -1) return true;
                        return 'Invalid Shard ID';
                    }
                }
            ]
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        const { shard } = args;
        const memory = await this.client.shard.broadcastEval('Math.round(process.memoryUsage().heapUsed / 1024 / 1024)');
        const uptime = await this.client.shard.fetchClientValues('uptime');
        const guilds = await this.client.shard.fetchClientValues('guilds.size');
        const embed = new RichEmbed()
            .setTitle(`Shard ${shard}`)
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
