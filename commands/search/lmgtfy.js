const { Command } = require('discord.js-commando');

module.exports = class LMGTFYCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lmgtfy',
            group: 'search',
            memberName: 'lmgtfy',
            description: 'Responds with a LMGTFY link.',
            args: [
                {
                    key: 'query',
                    prompt: 'What would you like to the link to search for?',
                    type: 'string',
                    parse: query => encodeURIComponent(query)
                }
            ]
        });
    }

    run(msg, args) {
        const { query } = args;
        return msg.say(`http://lmgtfy.com/?iie=1&q=${query}`);
    }
};
