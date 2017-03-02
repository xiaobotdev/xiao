const commando = require('discord.js-commando');
const Discord = require('discord.js');

class BanCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'ban', 
            group: 'moderation',
            memberName: 'ban',
            description: 'Bans a user. (;ban @User being a jerk. **Note: You must have a channel called "mod_logs!"**)',
            examples: [";ban @User being a jerk. **Note: You must have a channel called 'mod_logs!**"]
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
            message.reply(":x: This is a DM!");
        } else {
            let username = message.mentions.users.first();
            let member = message.guild.member(message.mentions.users.first());
            let reason = message.content.split(" ").slice(2).join(" ");
            if (message.mentions.users.size !== 1) {
                message.reply(":x: Either too many or no members, only mention one person!");
            } else {
                if(message.member.hasPermission('BAN_MEMBERS')) {
                    if(member.bannable === true) {
                        message.channel.sendMessage(":ok_hand:");
                        message.guild.member(username).ban();
                        if(message.guild.channels.exists("name", "mod_logs")) {
                            const embed = new Discord.RichEmbed()
                            .setAuthor(message.author.username + '#' + message.author.discriminator, message.author.avatarURL)
                            .setColor(0xFF0000)
                            .setFooter('XiaoBot Moderation', this.client.user.avatarURL)
                            .setTimestamp()
                            .addField('Information',
                            '**Member:** ' + username.username + '#' + username.discriminator + ' (' + username.id + ')\n**Action:** Ban\n**Reason:** ' + reason);
                            message.guild.channels.find('name', 'mod_logs').sendEmbed(embed).catch(console.error);
                        } else {
                            message.reply("**Note: No log will be sent, as there is not a channel named 'mod_logs'. Please create it to use the logging feature.**");
                        }
                    } else {
                        message.reply(":x: This member cannot be banned!");
                    }
                } else {
                    message.channel.sendMessage(":x: You don't have the Ban Members Permission!");
                }
            }
        }
    }
}

module.exports = BanCommand;