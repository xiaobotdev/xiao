const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const { version } = require('../../package.json');
const moment = require('moment');
require('moment-duration-format');

module.exports = class ShardInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'shardinfo',
            aliases: [
                'shard-info',
                'shard-data',
                'sharddata',
                'shard'
            ],
            group: 'util',
            memberName: 'shardinfo',
            description: 'Gives some bot info for the Shard you specify.',
            args: [{
                key: 'shardID',
                prompt: 'Which Shard would you like to get data for?',
                type: 'integer'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        const { shardID } = args;
        if (shardID > this.client.options.shardCount - 1 || shardID < 0) return message.say(':x: Error! Invalid Shard!');
        const memory = await this.client.shard.broadcastEval('Math.round(process.memoryUsage().heapUsed / 1024 / 1024)');
        const uptime = await this.client.shard.fetchClientValues('uptime');
        const guilds = await this.client.shard.fetchClientValues('guilds.size');
        const embed = new RichEmbed()
            .setColor(0x00AE86)
            .addField('Servers',
                guilds[shardID], true)
            .addField('Shard ID',
                shardID, true)
            .addField('Memory Usage',
                `${memory[shardID]}MB`, true)
            .addField('Uptime',
                moment.duration(uptime[shardID]).format('d[d]h[h]m[m]s[s]'), true)
            .addField('Version',
                version, true)
            .addField('Node Version',
                process.version, true);
        return message.embed(embed);
    }
};
