const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const moment = require('moment');
require('moment-duration-format');

module.exports = class GuildInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'server',
            aliases: ['guild', 'server-info', 'guild-info'],
            group: 'guildinfo',
            memberName: 'server',
            description: 'Gives some info on the current server.',
            guildOnly: true
        });
    }

    run(msg) {
        if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
            return msg.say('This Command requires the `Embed Links` Permission.');
        const embed = new RichEmbed()
            .setColor(0x00AE86)
            .setThumbnail(msg.guild.iconURL())
            .addField('Name',
                msg.guild.name, true)
            .addField('ID',
                msg.guild.id, true)
            .addField('Creation Date',
                stripIndents`
                    ${moment(msg.guild.createdTimestamp).format('MMMM Do YYYY h:mm:ss A')}
                    ${moment.duration(Date.now() - msg.guild.createdTimestamp).format('y[ years], M[ months], w[ weeks, and ]d[ days]')} ago.
                `)
            .addField('Default Channel',
                msg.guild.defaultChannel, true)
            .addField('Region',
                msg.guild.region, true)
            .addField('Owner',
                msg.guild.owner, true)
            .addField('Members',
                msg.guild.memberCount, true);
        return msg.embed(embed);
    }
};
