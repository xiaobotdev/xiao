const Command = require('../../structures/Command');

module.exports = class RollCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roll',
            aliases: ['dice'],
            group: 'response',
            memberName: 'roll',
            description: 'Rolls a dice with a maximum value you specify.',
            args: [
                {
                    key: 'value',
                    label: 'maximum number',
                    prompt: 'What is the maximum number you wish to appear?',
                    type: 'integer',
                    default: 6
                }
            ]
        });
    }

    run(msg, args) {
        const { value } = args;
        const roll = Math.floor(Math.random() * value) + 1;
        return msg.say(`You rolled a ${roll}.`);
    }
};
