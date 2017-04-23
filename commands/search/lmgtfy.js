const { Command } = require('discord.js-commando');

module.exports = class LMGTFYCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lmgtfy',
            group: 'search',
            memberName: 'lmgtfy',
            description: 'Responds with a LMGTFY link.',
            args: [{
                key: 'query',
                prompt: 'What would you like to the link to search for?',
                type: 'string',
                parse: text => {
                    return encodeURIComponent(text);
                }
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const { query } = args;
        return message.say(`http://lmgtfy.com/?iie=1&q=${query}`);
    }
};
