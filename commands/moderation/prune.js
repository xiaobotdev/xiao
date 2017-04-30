const { Command } = require('discord.js-commando');

module.exports = class PruneCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'prune',
            group: 'moderation',
            memberName: 'prune',
            description: 'Deletes a specified number of messages from the current channel, up to 99.',
            guildOnly: true,
            throttling: {
				usages: 1,
				duration: 60
			},
            args: [{
                key: 'count',
                prompt: 'How many messages do you want to delete? Limit of up to 99.',
                type: 'integer',
                validate: count => {
                    if (count < 100 && count > 0)
                        return true;
                    return `${count} is not a valid amount of messages. Limit 1-99.`;
                }
            }]
        });
    }
    
    hasPermission(msg) {
        return msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.roles.exists('name', msg.guild.settings.get('staffRole', 'Server Staff'));
    }

    async run(msg, args) {
        if (!msg.channel.permissionsFor(this.client.user).has('READ_MESSAGE_HISTORY'))
            return msg.say('This Command requires the `Read Message History` Permission.');
        if (!msg.channel.permissionsFor(this.client.user).has('MANAGE_MESSAGES'))
            return msg.say('This Command requires the `Manage Messages` Permission.');
        const { count } = args;
        try {
            const messages = await msg.channel.fetchMessages({
                limit: count + 1
            });
            await msg.channel.bulkDelete(messages, true);
            return null;
        } catch (err) {
            return msg.say('There are no messages younger than two weeks that can be deleted.');
        }
    }
};
