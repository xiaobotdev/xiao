const Command = require('../../structures/Command');

module.exports = class DivorceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'divorce',
            group: 'roleplay',
            memberName: 'divorce',
            description: 'Divorces something/someone.',
            args: [
                {
                    key: 'thing',
                    prompt: 'What do you want to roleplay with?',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, args) {
        const { thing } = args;
        return msg.say(`${msg.author} *divorces* ${thing}`);
    }
};
