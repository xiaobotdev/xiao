const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class UnbanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unban',
            aliases: ['unbanne'],
            group: 'moderation',
            memberName: 'unban',
            description: 'Unbans a user and logs the unban to the mod logs.',
            guildOnly: true,
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            args: [
                {
                    key: 'id',
                    prompt: 'What is the id of the member you want to unban?',
                    type: 'string'
                },
                {
                    key: 'reason',
                    prompt: 'What do you want to set the reason as?',
                    type: 'string',
                    validate: (reason) => {
                        if (reason.length < 140) return true;
                        else return 'Reason must be under 140 characters.';
                    }
                }
            ]
        });
    }

    async run(msg, args) {
        const modlogs = msg.guild.channels.get(msg.guild.settings.get('modLog'));
        const { id, reason } = args;
        const bans = await msg.guild.fetchBans();
        if (!bans.has(id)) return msg.say('This ID is not in the Guild Banlist.');
        const member = bans.get(id).user;
        try {
            await msg.say(`Are you sure you want to unban ${member.tag} (${member.id})?`);
            const collected = await msg.channel.awaitMessages((res) => res.author.id === msg.author.id, {
                max: 1,
                time: 15000,
                errors: ['time']
            });
            if (!['y', 'yes'].includes(collected.first().content.toLowerCase())) return msg.say('Aborting Unban.');
            await msg.guild.unban(member, `${msg.author.tag}: ${reason}`);
            await msg.say(`Successfully unbanned ${member.user.tag}.`);
            if (!modlogs || !modlogs.permissionsFor(this.client.user).has('SEND_MESSAGES')) {
                return msg.say('Could not log the unban to the mod logs.');
            } else if (!modlogs.permissionsFor(this.client.user).has('EMBED_LINKS')) {
                return modlogs.send(stripIndents`
                    **Member:** ${member.tag} (${member.id})
                    **Action:** Unban
                    **Reason:** ${reason}
                    **Moderator:** ${msg.author.tag}
                `);
            } else {
                const embed = new RichEmbed()
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                    .setColor(0x00AE86)
                    .setTimestamp()
                    .setDescription(stripIndents`
                        **Member:** ${member.tag} (${member.id})
                        **Action:** Unban
                        **Reason:** ${reason}
                    `);
                return modlogs.send({ embed });
            }
        } catch (err) {
            return msg.say('Aborting Unban.');
        }
    }
};
