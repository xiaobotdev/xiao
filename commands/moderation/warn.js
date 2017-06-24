const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class WarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            aliases: ['warnne'],
            group: 'moderation',
            memberName: 'warn',
            description: 'Warns a user and logs the warn to the mod logs.',
            guildOnly: true,
            userPermissions: ['KICK_MEMBERS'],
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
                    validate: (reason) => {
                        if (reason.length < 140) return true;
                        else return 'Invalid Reason. Reason must be under 140 characters.';
                    }
                }
            ]
        });
    }

    async run(msg, args) {
        const modlogs = msg.guild.channels.filter((c) => {
            const topic = c.topic || '';
            if (topic.includes('<modlog>')) return true;
            else return false;
        }).first() || member.guild.channels.find('name', 'mod-log');
        const { member, reason } = args;
        await msg.say(`Are you sure you want to warn ${member.user.tag} (${member.id})?`);
        const msgs = await msg.channel.awaitMessages((res) => res.author.id === msg.author.id, {
            max: 1,
            time: 30000
        });
        if (!msgs.size || !['y', 'yes'].includes(msgs.first().content.toLowerCase())) return msg.say('Aborting.');
        try {
            await member.user.send(stripIndents`
                You were warned in ${msg.guild.name}!
                Reason: ${reason}
            `);
        } catch (err) {
            await msg.say('Failed to Send DM.');
        }
        await msg.say(`Successfully warned ${member.user.tag}.`);
        if (!modlogs || !modlogs.permissionsFor(this.client.user).has('SEND_MESSAGES')) {
            return msg.say('Could not log the warn to the mod logs.');
        } else if (modlogs.permissionsFor(this.client.user).has('EMBED_LINKS')) {
            const embed = new RichEmbed()
                .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
                .setColor(0xFFFF00)
                .setTimestamp()
                .setDescription(stripIndents`
                    **Member:** ${member.user.tag} (${member.id})
                    **Action:** Warn
                    **Reason:** ${reason}
                `);
            return modlogs.send({ embed });
        } else {
            return modlogs.send(stripIndents`
                **Member:** ${member.user.tag} (${member.id})
                **Action:** Warn
                **Reason:** ${reason}
                **Moderator:** ${msg.author.tag}
            `);
        }
    }
};
