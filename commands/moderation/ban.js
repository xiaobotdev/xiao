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
            examples: [';ban @User being a jerk.'],
            guildOnly: true,
            args: [{
                key: 'member',
                prompt: 'What member do you want to ban?',
                type: 'member'
            }, {
                key: 'reason',
                prompt: 'What do you want to set the reason as?',
                type: 'string',
                validate: reason => {
                    if (reason.length < 141) {
                        return true;
                    }
                    return 'Please keep your reason under 140 characters.';
                }
            }]
        });
    }
    hasPermission(msg) {
        return msg.member.hasPermission('BAN_MEMBERS');
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        if (!message.guild.channels.exists('name', 'mod_logs')) return message.say(':x: Error! Could not find the mod_logs channel! Please create it!');
        const member = args.member;
        const reason = args.reason;
        if (!message.guild.member(member).bannable) return message.say(':x: Error! This member cannot be banned! Perhaps they have a higher role than me?');
        try {
            const banUser = await message.guild.member(member).ban();
            const okHandMsg = await message.say(':ok_hand:');
            const embed = new Discord.RichEmbed()
                .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
                .setColor(0xFF0000)
                .setFooter('XiaoBot Moderation', this.client.user.avatarURL)
                .setTimestamp()
                .setDescription(`**Member:** ${banUser.user.username}#${banUser.user.discriminator} (${member.id})\n**Action:** Ban\n**Reason:** ${reason}`);
            const modLogMsg = await message.guild.channels.find('name', 'mod_logs').sendEmbed(embed);
            return [banUser, okHandMsg, modLogMsg];
        }
        catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
