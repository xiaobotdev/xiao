const { Command } = require('discord.js-commando');

module.exports = class InviteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            group: 'util',
            memberName: 'invite',
            description: 'Sends you an invite for the bot and an invite to my server. (x;invite)',
            examples: ['x;invite']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const invite = await this.client.generateInvite('1345846343');
        return message.say(`Add me to your server with this link:\n${invite}\nOr, come to my server with this link:\n${this.client.options.invite}`);
    }
};
