const { Command } = require('discord.js-commando');

module.exports = class PruneCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'prune',
            aliases: [
                'clean',
                'bulkdelete'
            ],
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
                    if (count < 100 && count > 0) {
                        return true;
                    }
                    return `${count} is not a valid amount of messages. Limit 1-99.`;
                }
            }]
        });
    }
    
    hasPermission(msg) {
        return msg.member.hasPermission('MANAGE_MESSAGES');
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGE_HISTORY')) return message.say(':x: Error! I don\'t have the Read Message History Permission!');
            if (!message.channel.permissionsFor(this.client.user).hasPermission('MANAGE_MESSAGES')) return message.say(':x: Error! I don\'t have the Manage Messages Permission!');
        }
        let { count } = args;
        count = count + 1;
        try {
            const messages = await message.channel.fetchMessages({
                limit: count
            });
            await message.channel.bulkDelete(messages, true);
            return null;
        } catch (err) {
            return message.say(':x: Error! Something went wrong! Perhaps there are not enough messages in the channel from earlier than two weeks?');
        }
    }
};
