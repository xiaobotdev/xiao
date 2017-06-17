const Command = require('../../structures/Command');

module.exports = class LMGTFYCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lmgtfy',
            group: 'random',
            memberName: 'lmgtfy',
            description: 'Creates a LMGTFY link with the query you provide.',
            args: [
                {
                    key: 'query',
                    prompt: 'What would you like the link to search for?',
                    type: 'string',
                    parse: (query) => encodeURIComponent(query)
                }
            ]
        });
    }

    run(msg, args) {
        const { query } = args;
        return msg.say(`http://lmgtfy.com/?iie=1&q=${query}`);
    }
};
