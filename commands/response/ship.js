const Command = require('../../structures/Command');

module.exports = class ShipCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ship',
            aliases: ['rate'],
            group: 'response',
            memberName: 'ship',
            description: 'Ships things/people together.',
            args: [
                {
                    key: 'things',
                    prompt: 'What do you want to ship together?',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, args) {
        const { things } = args;
        const rating = Math.floor(Math.random() * 100) + 1;
        return msg.say(`I'd give ${things} a ${rating}%!`);
    }
};
