const commando = require('discord.js-commando');
const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = class GuildInfoCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'server',
            aliases: [
                'guild',
                'serverinfo',
                'guildinfo'
            ],
            group: 'guildinfo',
            memberName: 'server',
            description: 'Gives some info on the current server. (;server)',
            examples: [';server']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        if (message.channel.type === 'dm') {
            return message.channel.send(":x: Error! This command does not work in DM!");
        }
        const embed = new Discord.RichEmbed()
            .setColor(0x00AE86)
            .setThumbnail(message.guild.iconURL)
            .addField('**Name:**',
                message.guild.name, true)
            .addField('**ID:**',
                message.guild.id, true)
            .addField('**Created On:**',
                `${message.guild.createdAt} (${moment.duration(message.guild.createdTimestamp - Date.now()).format('y[ years], M[ months], w[ weeks, and ]d[ days]')} ago)`, true)
            .addField('**Default Channel:**',
                message.guild.defaultChannel, true)
            .addField('**Region:**',
                message.guild.region, true)
            .addField('**Owner:**',
                `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
            .addField("**Users:**",
                message.guild.memberCount, true);
        return message.channel.sendEmbed(embed);
    }
};
