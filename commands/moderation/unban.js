const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class UnbanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unban',
            aliases: [
                'unbanne'
            ],
            group: 'moderation',
            memberName: 'unban',
            description: 'Unbans a user and logs the unban to the mod_logs.',
            guildOnly: true,
            args: [
                {
                    key: 'id',
                    prompt: 'What member do you want to unban? Please enter the ID of the user.',
                    type: 'string',
                    validate: id => {
                        if (id.length === 18)
                            return true;
                        return `${id} is not a valid ID. Please enter the user you wish to unban's ID.`;
                    }
                },
                {
                    key: 'reason',
                    prompt: 'What do you want to set the reason as?',
                    type: 'string',
                    validate: reason => {
                        if (reason.length < 140)
                            return true;
                        return `Please keep your reason under 140 characters, you have ${reason.length}.`;
                    }
                }
            ]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('BAN_MEMBERS') || msg.member.roles.exists('name', msg.guild.settings.get('staffRole', 'Server Staff'));
    }

    async run(msg, args) {
        if (!msg.channel.permissionsFor(this.client.user).has('BAN_MEMBERS'))
            return msg.say('This Command requires the `Ban Members` Permission.');
        const modlogs = msg.guild.channels.find('name', msg.guild.settings.get('modLog', 'mod_logs'));
        if (!modlogs)
            return msg.say('This Command requires a channel named `mod_logs` or one custom set with the `modchannel` command.');
        if (!modlogs.permissionsFor(this.client.user).has('EMBED_LINKS'))
            return msg.say('This Command requires the `Embed Links` Permission.');
        const { id, reason } = args;
        const bans = await msg.guild.fetchBans();
        if (!bans.has(id))
            return msg.say('This ID is not in the Guild Banlist.');
        const member = bans.get(id);
        try {
            await msg.guild.unban(member);
            await msg.say(':ok_hand:');
            const embed = new RichEmbed()
                .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                .setColor(0x00AE86)
                .setTimestamp()
                .setDescription(stripIndents`
                    **Member:** ${member.tag} (${member.id})
                    **Action:** Unban
                    **Reason:** ${reason}
                `);
            return modlogs.send({embed});
        } catch (err) {
            return msg.say('An Unknown Error Occurred.');
        }
    }
};
