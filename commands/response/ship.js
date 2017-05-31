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
        let response;
        if (rating < 25) response = 'Ouch. Might want to keep them apart.';
        else if (rating < 50) response = 'Meh, they should keep looking.';
        else if (rating < 75) response = 'Could be worse, they should try it.';
        else if (rating < 90) response = 'Not too bad. It might work out.';
        else response = 'These guys have one bright future ahead of them!';
        return msg.say(`I'd give ${things} a ${rating}%! ${response}`);
    }
};
