const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class SoftbanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'softban',
            group: 'moderation',
            memberName: 'softban',
            description: 'Kicks a user and deletes their messages, and logs the softban to the mod_logs.',
            guildOnly: true,
            args: [{
                key: 'member',
                prompt: 'What member do you want to softban?',
                type: 'member'
            }, {
                key: 'reason',
                prompt: 'What do you want to set the reason as?',
                type: 'string',
                validate: reason => {
                    if (reason.length < 140) {
                        return true;
                    }
                    return `Please keep your reason under 140 characters, you have ${reason.length}.`;
                }
            }]
        });
    }
    
    hasPermission(msg) {
        return msg.member.permissions.has('KICK_MEMBERS') || msg.member.roles.exists('name', 'Server Staff');
    }

    async run(message, args) {
        if (!message.channel.permissionsFor(this.client.user).has('BAN_MEMBERS'))
            return message.say('This Command requires the `Ban Members` Permission.');
        if (!message.channel.permissionsFor(this.client.user).has('KICK_MEMBERS'))
            return message.say('This Command requires the `Kick Members` Permission.');
        const modlogs = message.guild.channels.find('name', message.guild.settings.get('modLog', 'mod_logs'));
        if (!modlogs)
            return message.say('This Command requires a channel named `mod_logs` or one custom set with the `modchannel` command.');
        if (!modlogs.permissionsFor(this.client.user).has('EMBED_LINKS'))
            return message.say('This Command requires the `Embed Links` Permission.');
        const { member, reason } = args;
        if (!member.bannable)
            return message.say('This member is not bannable. Perhaps they have a higher role than me?');
        try {
            try {
                await member.send(`You were softbanned from ${message.guild.name}!\nReason: ${reason}.`);
            } catch (err) {
                await message.say('Failed to send DM to user.');
            }
            await member.ban(7);
            await message.guild.unban(member.user);
            await message.say(':ok_hand:');
            const embed = new RichEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL)
                .setColor(0xFF0000)
                .setTimestamp()
                .setDescription(`**Member:** ${member.user.tag} (${member.id})\n**Action:** Ban\n**Reason:** ${reason}`);
            return modlogs.send({embed});
        } catch (err) {
            return message.say('An Unknown Error Occurred.');
        }
    }
};
