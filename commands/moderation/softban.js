const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class SoftbanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'softban',
            aliases: ['softbanne'],
            group: 'moderation',
            memberName: 'softban',
            description: 'Kicks a user and deletes their messages, and logs the softban to the mod logs.',
            guildOnly: true,
            args: [
                {
                    key: 'member',
                    prompt: 'What member do you want to softban?',
                    type: 'member'
                },
                {
                    key: 'reason',
                    prompt: 'What do you want to set the reason as?',
                    type: 'string',
                    validate: reason => {
                        if (reason.length < 140) return true;
                        return 'Invalid Reason. Reason must be under 140 characters.';
                    }
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('KICK_MEMBERS') || msg.member.roles.has(msg.guild.settings.get('staffRole'));
    }

    async run(msg, args) {
        if (!msg.channel.permissionsFor(this.client.user).has('BAN_MEMBERS'))
            return msg.say('This Command requires the `Ban Members` Permission.');
        if (!msg.channel.permissionsFor(this.client.user).has('KICK_MEMBERS'))
            return msg.say('This Command requires the `Kick Members` Permission.');
        const modlogs = msg.guild.channels.get(msg.guild.settings.get('modLog'));
        if (!modlogs) return msg.say('This Command requires a channel set with the `modchannel` command.');
        if (!modlogs.permissionsFor(this.client.user).has('SEND_MESSAGES'))
            return msg.say('This Command requires the `Send Messages` Permission for the Mod Log Channel.');
        if (!modlogs.permissionsFor(this.client.user).has('EMBED_LINKS'))
            return msg.say('This Command requires the `Embed Links` Permission.');
        const { member, reason } = args;
        if (!member.bannable) return msg.say('This member is not softbannable. Perhaps they have a higher role than me?');
        try {
            try {
                await member.user.send(stripIndents`
                    You were softbanned from ${msg.guild.name}!
                    Reason: ${reason}.
                `);
            } catch (err) {
                await msg.say('Failed to Send DM.');
            }
            await member.ban({ days: 7, reason });
            await msg.guild.unban(member.user);
            msg.say(':ok_hand:');
            const embed = new RichEmbed()
                .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                .setColor(0xFF4500)
                .setTimestamp()
                .setDescription(stripIndents`
                    **Member:** ${member.user.tag} (${member.id})
                    **Action:** Softban
                    **Reason:** ${reason}
                `);
            await modlogs.send({ embed });
            return null;
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
