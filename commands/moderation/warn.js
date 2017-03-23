const commando = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class WarnCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'warn',
            group: 'moderation',
            memberName: 'warn',
            description: 'Warns a user. (;warn @User being a jerk)',
            examples: [";warn @User being a jerk."]
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log("[Command] " + message.content);
        if (message.channel.type !== 'dm') {
            let userToWarn = message.mentions.users.first();
            let reason = message.content.split(" ").slice(2).join(" ");
            if (message.mentions.users.size !== 1) {
                message.channel.send(":x: Error! Please mention one user!");
            }
            else {
                if (message.member.hasPermission('MANAGE_MESSAGES')) {
                    message.channel.send(":ok_hand:");
                    if (message.guild.channels.exists("name", "mod_logs")) {
                        const embed = new Discord.RichEmbed()
                            .setAuthor(message.author.username + '#' + message.author.discriminator, message.author.avatarURL)
                            .setColor(0xFFFF00)
                            .setFooter('XiaoBot Moderation', this.client.user.avatarURL)
                            .setTimestamp()
                            .setDescription('**Member:** ' + userToWarn.username + '#' + userToWarn.discriminator + ' (' + userToWarn.id + ')\n**Action:** Warn\n**Reason:** ' + reason);
                        message.guild.channels.find('name', 'mod_logs').sendEmbed(embed).catch(console.error);
                    }
                    else {
                        message.channel.send("**Note: No log will be sent, as there is not a channel named 'mod_logs'. Please create it to use the logging feature.**");
                    }
                }
                else {
                    message.channel.send(":x: Error! You don't have the Manage Messages Permission!");
                }
            }
        }
        else {
            message.channel.send(":x: Error! This command does not work in DM!");
        }
    }
};
