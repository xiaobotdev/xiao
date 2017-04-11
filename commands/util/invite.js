const { Command } = require('discord.js-commando');

module.exports = class InviteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            group: 'util',
            memberName: 'invite',
            description: 'Sends you an invite for the bot and an invite to my server. (;invite)',
            examples: [';invite']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        return message.say('Add me to your server with this link:\nhttps://discordapp.com/oauth2/authorize?client_id=278305350804045834&scope=bot&permissions=1345846343\nOr, come to my server with this link:\nhttps://discord.gg/fqQF8mc');
    }
};
