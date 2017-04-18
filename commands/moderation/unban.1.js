const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class Unban1Command extends Command {
    constructor(client) {
        super(client, {
            name: 'unban1',
            aliases: [
                'unbanne1'
            ],
            group: 'moderation',
            memberName: 'unban1',
            description: 'Unbans a user (TEST). (;unban USERID not being a jerk.)',
            examples: [';unban USERID not being a jerk.'],
            guildOnly: true,
            args: [{
                key: 'member',
                prompt: 'What member do you want to unban? Please enter the ID of the user.',
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
        return this.client.isOwner(msg.author);
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
            if (!message.channel.permissionsFor(this.client.user).hasPermission('BAN_MEMBERS')) return message.say(':x: Error! I don\'t have the Ban Members Permission!');
        }
        if (!message.guild.channels.exists('name', 'mod_logs')) return message.say(':x: Error! Could not find the mod_logs channel! Please create it!');
        const memberID = args.memberID;
        const reason = args.reason;
        const bans = await message.guild.fetchBans();
        if (!bans.has(memberID)) return message.say(':x: Error! Could not find this user in the bans.');
        const unbanUser = await bans.get(memberID);
        try {
            await message.guild.unban(unbanUser);
            await message.say(':ok_hand:');
            const embed = new RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setColor(0x00AE86)
                .setTimestamp()
                .setDescription(`**Member:** ${unbanUser.tag} (${unbanUser.id})\n**Action:** Unban\n**Reason:** ${reason}`);
            return message.guild.channels.find('name', 'mod_logs').send({embed});
        } catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
