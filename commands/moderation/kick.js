const commando = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class KickCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'kick',
            group: 'moderation',
            memberName: 'kick',
            description: 'Kicks a user. (;kick @User being a jerk.)',
            examples: [";kick @User being a jerk."]
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        if (message.channel.type !== 'dm') {
            let userToKick = message.mentions.users.first();
            let reason = message.content.split(" ").slice(2).join(" ");
            if (message.mentions.users.size !== 1) {
                let mentionError = await message.channel.send(":x: Error! Please mention one user!");
            }
            else {
                if (message.member.hasPermission('KICK_MEMBERS')) {
                    if (message.guild.member(userToKick).kickable) {
                        let okHandMes = await message.channel.send(":ok_hand:");
                        let kickMember = await message.guild.member(userToKick).kick();
                        if (message.guild.channels.exists("name", "mod_logs")) {
                            const embed = new Discord.RichEmbed()
                                .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
                                .setColor(0xFFA500)
                                .setFooter('XiaoBot Moderation', this.client.user.avatarURL)
                                .setTimestamp()
                                .setDescription(`**Member:** ${userToKick.username}#${userToKick.discriminator} (${userToKick.id})\n**Action:** Kick\n**Reason:** ${reason}`);
                            let modLog = await message.guild.channels.find('name', 'mod_logs').sendEmbed(embed).catch(console.error);
                        }
                        else {
                            let modLogNote = await message.channel.send(":notepad_spiral: **Note: No log will be sent, as there is not a channel named 'mod_logs'. Please create it to use the logging feature.**");
                        }
                    }
                    else {
                        let kickErr = await message.channel.send(":x: Error! This member cannot be kicked! Perhaps they have a higher role than me?");
                    }
                }
                else {
                    let permissionErr = await message.channel.send(":x: Error! You don't have the Kick Members Permission!");
                }
            }
        }
        else {
            let dmErr = await message.channel.send(":x: Error! This command does not work in DM!");
        }
    }
};
