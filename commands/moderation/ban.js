const commando = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class BanCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'ban',
            aliases: [
                'banne'
            ],
            group: 'moderation',
            memberName: 'ban',
            description: 'Bans a user. (;ban @User being a jerk.)',
            examples: [";ban @User being a jerk."]
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        if (message.channel.type !== 'dm') {
            let userToBan = message.mentions.users.first();
            let reason = message.content.split(" ").slice(2).join(" ");
            if (message.mentions.users.size !== 1) {
                let mentionError = await message.channel.send(":x: Error! Please mention one user!");
            }
            else {
                if (message.member.hasPermission('BAN_MEMBERS')) {
                    if (message.guild.member(userToBan).bannable) {
                        let okHandMes = await message.channel.send(":ok_hand:");
                        let banMember = await message.guild.member(userToBan).ban();
                        if (message.guild.channels.exists("name", "mod_logs")) {
                            const embed = new Discord.RichEmbed()
                                .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
                                .setColor(0xFF0000)
                                .setFooter('XiaoBot Moderation', this.client.user.avatarURL)
                                .setTimestamp()
                                .setDescription(`**Member:** ${userToBan.username}#${userToBan.discriminator} (${userToBan.id})\n**Action:** Ban\n**Reason:** ${reason}`);
                            let modLog = await message.guild.channels.find('name', 'mod_logs').sendEmbed(embed);
                        }
                        else {
                            let modLogNote = await message.channel.send(":notepad_spiral: **Note: No log will be sent, as there is not a channel named 'mod_logs'. Please create it to use the logging feature.**");
                        }
                    }
                    else {
                        let banErr = await message.channel.send(":x: Error! This member cannot be banned! Perhaps they have a higher role than me?");
                    }
                }
                else {
                    let permissionErr = await message.channel.send(":x: Error! You don't have the Ban Members Permission!");
                }
            }
        }
        else {
            let dmErr = await message.channel.send(":x: Error! This command does not work in DM!");
        }
    }
};
