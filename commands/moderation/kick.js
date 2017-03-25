const commando = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class KickCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'kick',
            group: 'moderation',
            memberName: 'kick',
            description: 'Kicks a user. (;kick @User being a jerk.)',
            examples: [";kick @User being a jerk."],
            guildOnly: true,
            args: [{
                key: 'member',
                prompt: 'What member do you want to kick?',
                type: 'member'
            }, {
                key: 'reason',
                prompt: 'What do you want to set the reason as?',
                type: 'string'
            }]
        });
    }
    hasPermission(msg) {
        return msg.member.hasPermission('KICK_MEMBERS');
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        if (!message.guild.channels.exists("name", "mod_logs")) return message.channel.send(":x: Error! Could not find the mod_logs channel! Please create it!");
        let member = args.member;
        let reason = args.reason;
        if (!message.guild.member(member).bannable) return message.channel.send(":x: Error! This member cannot be kicked! Perhaps they have a higher role than me?");
        let kickUser = await message.guild.member(member).kick();
        let okHandMsg = await message.channel.send(":ok_hand:");
        const embed = new Discord.RichEmbed()
            .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
            .setColor(0xFFA500)
            .setFooter('XiaoBot Moderation', this.client.user.avatarURL)
            .setTimestamp()
            .setDescription(`**Member:** ${kickUser.user.username}#${kickUser.user.discriminator} (${member.id})\n**Action:** Kick\n**Reason:** ${reason}`);
        let modLogMsg = await message.guild.channels.find('name', 'mod_logs').sendEmbed(embed);
        return [kickUser, okHandMsg, modLogMsg];
    }
};
