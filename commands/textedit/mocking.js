const Command = require('../../structures/Command');

module.exports = class MockingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mocking',
            aliases: ['mock'],
            group: 'textedit',
            memberName: 'mocking',
            description: 'I aM a caT, I LIkE To DrInK mILK.',
            clientPermissions: ['USE_EXTERNAL_EMOJIS'],
            args: [
                {
                    key: 'text',
                    prompt: 'WHaT tEXt WoUlD yOu LiKE to COnvErt?',
                    type: 'string',
                    validate: (text) => {
                        if (text.length < 1950) return true;
                        else return 'Invalid Text. Text must be under 1950 characters.';
                    },
                    parse: (text) => text.split('')
                }
            ]
        });
    }

    run(msg, args) {
        const { text } = args;
        for (let i = 0; i < text.length; i += Math.floor(Math.random() * 4)) text[i] = text[i].toUpperCase();
        return msg.say(`\u180E${text.join('')} <:sponge:318612443398144000>`);
    }
};

