const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const { oneLine } = require('common-tags');
const { version } = require('../../package');
const moment = require('moment');
require('moment-duration-format');

module.exports = class InfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'info',
            aliases: ['information', 'stats'],
            group: 'util',
            memberName: 'info',
            description: 'Gives some bot info.'
        });
    }

    async run(msg) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        const guilds = await this.client.shard.fetchClientValues('guilds.size');
        const memory = await this.client.shard.broadcastEval('Math.round(process.memoryUsage().heapUsed / 1024 / 1024)');
        const embed = new RichEmbed()
            .setColor(0x00AE86)
            .setFooter(oneLine`
                ©2017 dragonfire535#8081 |
                Created ${moment.duration(Date.now() - this.client.user.createdTimestamp).format('y[ years], M[ months], w[ weeks, and ]d[ days]')} ago!
            `)
            .addField('Servers',
                guilds.reduce((prev, val) => prev + val, 0), true)
            .addField('Shards',
                this.client.options.shardCount, true)
            .addField('Commands',
                this.client.registry.commands.size, true)
            .addField('Source Code',
                '[View Here](https://github.com/dragonfire535/xiaobot)', true)
            .addField('Memory Usage',
                `${memory.reduce((prev, val) => prev + val, 0)}MB`, true)
            .addField('Uptime',
                moment.duration(this.client.uptime).format('d[d]h[h]m[m]s[s]'), true)
            .addField('Version',
                `v${version}`, true)
            .addField('Node Version',
                process.version, true)
            .addField('Library',
                '[discord.js](https://github.com/hydrabolt/discord.js)[-commando](https://github.com/Gawdl3y/discord.js-commando)', true);
        return msg.embed(embed);
    }
};
