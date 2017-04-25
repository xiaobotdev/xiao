const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class WarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            group: 'moderation',
            memberName: 'warn',
            description: 'Warns a user and logs the warn to the mod_logs.',
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
                    if (reason.length < 140)
                        return true;
                    return `Please keep your reason under 140 characters, you have ${reason.length}.`;
                }
            }]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('MANAGE_MESSAGES');
    }

    async run(message, args) {
        if (!message.channel.permissionsFor(this.client.user).hasPermission('BAN_MEMBERS'))
            return message.say(':x: Error! I don\'t have the Ban Members Permission!');
        const modlogs = message.guild.channels.find('name', 'mod_logs');
        if (!modlogs)
            return message.say(':x: Error! Could not find the mod_logs channel! Please create it!');
        if (!modlogs.permissionsFor(this.client.user).hasPermission('EMBED_LINKS'))
            return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        const { member, reason } = args;
        try {
            await message.say(':ok_hand:');
            const embed = new RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setColor(0xFFFF00)
                .setTimestamp()
                .setDescription(`**Member:** ${member.user.tag} (${member.id})\n**Action:** Warn\n**Reason:** ${reason}`);
            return modlogs.send({embed});
        } catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
