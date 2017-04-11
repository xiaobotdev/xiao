const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class KickCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            group: 'moderation',
            memberName: 'kick',
            description: 'Kicks a user. (;kick @User being a jerk.)',
            examples: [';kick @User being a jerk.'],
            guildOnly: true,
            args: [{
                key: 'member',
                prompt: 'What member do you want to kick?',
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
        return msg.member.hasPermission('KICK_MEMBERS');
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
            if (!message.channel.permissionsFor(this.client.user).hasPermission('KICK_MEMBERS')) return message.say(':x: Error! I don\'t have the Kick Members Permission!');
        }
        if (!message.guild.channels.exists('name', 'mod_logs')) return message.say(':x: Error! Could not find the mod_logs channel! Please create it!');
        const member = args.member;
        const reason = args.reason;
        if (!member.bannable) return message.say(':x: Error! This member cannot be kicked! Perhaps they have a higher role than me?');
        try {
            await member.kick();
            await message.say(':ok_hand:');
            const embed = new RichEmbed()
                .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
                .setColor(0xFFA500)
                .setTimestamp()
                .setDescription(`**Member:** ${member.user.username}#${member.user.discriminator} (${member.id})\n**Action:** Kick\n**Reason:** ${reason}`);
            return message.guild.channels.find('name', 'mod_logs').sendEmbed(embed);
        }
        catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
