const commando = require('discord.js-commando');
const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = class GuildInfoCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'server',
            aliases: [
                'guild',
                'serverinfo',
                'guildinfo'
            ],
            group: 'guildinfo',
            memberName: 'server',
            description: 'Gives some info on the current server. (;server)',
            examples: [';server'],
            guildOnly: true
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        const embed = new Discord.RichEmbed()
            .setColor(0x00AE86)
            .setThumbnail(message.guild.iconURL)
            .addField('**Name:**',
                message.guild.name, true)
            .addField('**ID:**',
                message.guild.id, true)
            .addField('**Created On:**',
                `${message.guild.createdAt}\n${moment.duration(Date.now() - message.guild.createdTimestamp).format('y[ years], M[ months], w[ weeks, and ]d[ days]')} ago.`, true)
            .addField('**Default Channel:**',
                message.guild.defaultChannel, true)
            .addField('**Region:**',
                message.guild.region, true)
            .addField('**XiaoBot Shard:**',
                this.client.shard.id, true)
            .addField('**Owner:**',
                `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
            .addField('**Users:**',
                `${message.guild.memberCount} (With Bots) / ${message.guild.members.filter(member => !member.user.bot).size} (Without Bots)`, true);
        return message.embed(embed);
    }
};
