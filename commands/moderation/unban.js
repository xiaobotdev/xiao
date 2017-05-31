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
            allowStaff: true,
            args: [
                {
                    key: 'id',
                    prompt: 'What member do you want to unban? Please enter the ID of the user.',
                    type: 'string'
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

    async run(msg, args) {
        const modlogs = msg.guild.channels.get(msg.guild.settings.get('modLog'));
        if (!modlogs) return msg.say('This Command requires a channel set with the `mod-channel` command.');
        if (!modlogs.permissionsFor(this.client.user).has('SEND_MESSAGES'))
            return msg.say('This Command requires the `SEND_MESSAGES` Permission for the Mod Log Channel.');
        if (!modlogs.permissionsFor(this.client.user).has('EMBED_LINKS'))
            return msg.say('This Command requires the `EMBED_LINKS` Permission for the Mod Log Channel.');
        const { id, reason } = args;
        const bans = await msg.guild.fetchBans();
        if (!bans.has(id)) return msg.say('This ID is not in the Guild Banlist.');
        const member = bans.get(id).user;
        try {
            await msg.guild.unban(member, reason);
            msg.say(':ok_hand:');
            const embed = new RichEmbed()
                .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                .setColor(0x00AE86)
                .setTimestamp()
                .setDescription(stripIndents`
                    **Member:** ${member.tag} (${member.id})
                    **Action:** Unban
                    **Reason:** ${reason}
                `);
            modlogs.send({ embed });
            return null;
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
