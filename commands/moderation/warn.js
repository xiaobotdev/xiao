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
                type: 'string'
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
        let userToWarn = args.member;
        let reason = args.reason;
        if (!message.guild.channels.exists("name", "mod_logs")) return message.channel.send(":x: Error! Could not find the mod_logs channel! Please create it!");
        let okHandMsg = await message.channel.send(":ok_hand:");
        const embed = new Discord.RichEmbed()
            .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
            .setColor(0xFFFF00)
            .setFooter('XiaoBot Moderation', this.client.user.avatarURL)
            .setTimestamp()
            .setDescription(`**Member:** ${userToWarn.user.username}#${userToWarn.user.discriminator} (${userToWarn.id})\n**Action:** Warn\n**Reason:** ${reason}`);
        let modLogMsg = await message.guild.channels.find('name', 'mod_logs').sendEmbed(embed);
        return [okHandMsg, modLogMsg];
    }
};
