const commando = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class WarnCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'warn',
            group: 'moderation',
            memberName: 'warn',
            description: 'Warns a user. (;warn @User being a jerk)',
            examples: [";warn @User being a jerk."],
            guildOnly: true,
            args: [{
                key: 'member',
                prompt: 'What member do you want to warn?',
                type: 'member'
            }, {
                key: 'reason',
                prompt: 'What do you want to set the reason as?',
                type: 'string',
                validate: reason => {
                    if (reason.length < 141) {
                        return true;
                    }
                    return "Please keep your reason under 140 characters.";
                }
            }]
        });
    }
    hasPermission(msg) {
        return msg.member.hasPermission('MANAGE_MESSAGES');
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        const userToWarn = args.member;
        const reason = args.reason;
        if (!message.guild.channels.exists("name", "mod_logs")) return message.say(":x: Error! Could not find the mod_logs channel! Please create it!");
        try {
            const okHandMsg = await message.say(":ok_hand:");
            const embed = new Discord.RichEmbed()
                .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
                .setColor(0xFFFF00)
                .setFooter('XiaoBot Moderation', this.client.user.avatarURL)
                .setTimestamp()
                .setDescription(`**Member:** ${userToWarn.user.username}#${userToWarn.user.discriminator} (${userToWarn.id})\n**Action:** Warn\n**Reason:** ${reason}`);
            const modLogMsg = await message.guild.channels.find('name', 'mod_logs').sendEmbed(embed);
            return [okHandMsg, modLogMsg];
        }
        catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
