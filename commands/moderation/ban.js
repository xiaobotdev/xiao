const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class BanCommand extends Command {
    constructor(client) {
        super(client, {
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
                type: 'user'
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
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
            if (!message.channel.permissionsFor(this.client.user).hasPermission('BAN_MEMBERS')) return message.say(':x: Error! I don\'t have the Ban Members Permission!');
        }
        if (!message.guild.channels.exists('name', 'mod_logs')) return message.say(':x: Error! Could not find the mod_logs channel! Please create it!');
        let member = message.guild.member(args.member);
        if (!member) member = await message.guild.fetchMember(args.member);
        const reason = args.reason;
        if (!member.bannable) return message.say(':x: Error! This member cannot be banned! Perhaps they have a higher role than me?');
        try {
            await member.ban(7);
            await message.say(':ok_hand:');
            const embed = new RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setColor(0xFF0000)
                .setTimestamp()
                .setDescription(`**Member:** ${member.user.tag} (${member.id})\n**Action:** Ban\n**Reason:** ${reason}`);
            return message.guild.channels.find('name', 'mod_logs').send({embed});
        } catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
