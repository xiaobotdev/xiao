const { Command } = require('discord.js-commando');

module.exports = class ShipCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ship',
            aliases: [
                'rate'
            ],
            group: 'response',
            memberName: 'ship',
            description: 'Ships things/people together.',
            args: [{
                key: 'things',
                prompt: 'What do you want to ship together?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        const { things } = args;
        const percentage = Math.floor(Math.random() * 100) + 1;
        return message.say(`I'd give ${things} a ${percentage}%!`);
    }
};
