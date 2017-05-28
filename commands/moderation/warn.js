const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class WarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            group: 'moderation',
            memberName: 'warn',
            description: 'Warns a user and logs the warn to the mod logs.',
            guildOnly: true,
            args: [
                {
                    key: 'member',
                    prompt: 'What member do you want to warn?',
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
        const staffRole = msg.guild.roles.get(msg.guild.settings.get('staffRole'));
        if (staffRole && !msg.member.roles.has(staffRole)) return `You do not have the ${staffRole.name} role.`;
        else if (!msg.member.hasPermission('KICK_MEMBERS')) return 'You do not have the `Kick Members` Permission.';
        else return true;
    }

    async run(msg, args) {
        const modlogs = msg.guild.channels.get(msg.guild.settings.get('modLog'));
        if (!modlogs) return msg.say('This Command requires a channel set with the `modchannel` command.');
        if (!modlogs.permissionsFor(this.client.user).has('SEND_MESSAGES'))
            return msg.say('This Command requires the `Send Messages` Permission for the Mod Log Channel.');
        if (!modlogs.permissionsFor(this.client.user).has('EMBED_LINKS'))
            return msg.say('This Command requires the `Embed Links` Permission.');
        const { member, reason } = args;
        if (!member.kickable) return msg.say('This member is not warnable. Perhaps they have a higher role than me?');
        try {
            await member.user.send(stripIndents`
                You were warned in ${msg.guild.name}!
                Reason: ${reason}.
            `);
        } catch (err) {
            await msg.say('Failed to Send DM.');
        }
        msg.say(':ok_hand:');
        const embed = new RichEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
            .setColor(0xFFFF00)
            .setTimestamp()
            .setDescription(stripIndents`
                **Member:** ${member.user.tag} (${member.id})
                **Action:** Warn
                **Reason:** ${reason}
            `);
        await modlogs.send({ embed });
        return null;
    }
};
