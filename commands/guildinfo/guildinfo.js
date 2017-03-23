const commando = require('discord.js-commando');
const Discord = require('discord.js');

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

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log("[Command] " + message.content);
        if (message.channel.type !== 'dm') {
            const embed = new Discord.RichEmbed()
                .setColor(0x00AE86)
                .setThumbnail(message.guild.iconURL)
                .addField('**Name:**',
                    message.guild.name, true)
                .addField('**ID:**',
                    message.guild.id, true)
                .addField('**Created On:**',
                    message.guild.createdAt, true)
                .addField('**Default Channel:**',
                    message.guild.defaultChannel, true)
                .addField('**Region:**',
                    message.guild.region, true)
                .addField('**Owner:**',
                    message.guild.owner.user.username + '#' + message.guild.owner.user.discriminator, true)
                .addField("**Users:**",
                    message.guild.memberCount, true);
            message.channel.sendEmbed(embed).catch(console.error);
        }
        else {
            message.channel.send(":x: Error! This command does not work in DM!");
        }
    }
};
