const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const moment = require('moment');
const filterLevels = ['Off', 'No Role', 'Everyone'];

module.exports = class GuildInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'server-info',
            aliases: ['guild', 'server', 'guild-info'],
            group: 'guildinfo',
            memberName: 'server-info',
            description: 'Gives some info on the server.',
            guildOnly: true,
            clientPermissions: ['EMBED_LINKS']
        });
    }

    run(msg) {
        const embed = new RichEmbed()
            .setColor(0x00AE86)
            .setThumbnail(msg.guild.iconURL())
            .addField('❯ Name',
                msg.guild.name, true)
            .addField('❯ ID',
                msg.guild.id, true)
            .addField('❯ Creation Date',
                moment(msg.guild.createdAt).format('MMMM Do YYYY'), true)
            .addField('❯ Default Channel',
                msg.guild.defaultChannel, true)
            .addField('❯ Region',
                msg.guild.region, true)
            .addField('❯ Explicit Filter',
                filterLevels[msg.guild.explicitContentFilter], true)
            .addField('❯ Owner',
                msg.guild.owner, true)
            .addField('❯ Members',
                msg.guild.memberCount, true);
        return msg.embed(embed);
    }
};
