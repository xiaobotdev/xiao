const commando = require('discord.js-commando');
const Discord = require('discord.js');

class WarnCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'warn', 
            group: 'moderation',
            memberName: 'warn',
            description: 'Warns a user. (;warn @User being a jerk **Note: You must have a channel called "mod_logs!"**)',
            examples: [";warn @User being a jerk. **Note: You must have a channel called 'mod_logs!**"]
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('KICK_MEMBERS')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('BAN_MEMBERS')) return;
        }
        console.log("[Command] " + message.content);
        if (message.channel.type === 'dm') {
            message.channel.send(":x: This is a DM!");
        } else {
            let username = message.mentions.users.first();
            let reason = message.content.split(" ").slice(2).join(" ");
            if (message.mentions.users.size !== 1) {
                message.channel.send(":x: Either too many or no members, only mention one person!");
            } else {
                if(message.member.hasPermission('KICK_MEMBERS')) {
                    message.channel.send(":ok_hand:");
                    if(message.guild.channels.exists("name", "mod_logs")) {
                        const embed = new Discord.RichEmbed()
                        .setAuthor(message.author.username + '#' + message.author.discriminator, message.author.avatarURL)
                        .setColor(0xFFFF00)
                        .setFooter('XiaoBot Moderation', this.client.user.avatarURL)
                        .setTimestamp()
                        .setDescription('**Member:** ' + username.username + '#' + username.discriminator + ' (' + username.id + ')\n**Action:** Warn\n**Reason:** ' + reason);
                        message.guild.channels.find('name', 'mod_logs').sendEmbed(embed).catch(console.error);
                    } else {
                        message.channel.send("**Note: No log will be sent, as there is not a channel named 'mod_logs'. Please create it to use the logging feature.**");
                    }
                } else {
                    message.channel.send(":x: You don't have the Kick Members Permission!");
                }
            }
        }
    }
}

module.exports = WarnCommand;