const Command = require('../../structures/Command');
const eastereggs = require('../../assets/json/easter-egg');

module.exports = class EasterEggCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'easter-egg',
            aliases: ['tag'],
            group: 'random',
            memberName: 'easter-egg',
            description: 'Can you discover all the easter eggs?',
            args: [
                {
                    key: 'tag',
                    prompt: 'What easter egg do you want to view?',
                    type: 'string',
                    validate: (tag) => {
                        if (eastereggs[tag.toLowerCase()]) return true;
                        else return 'Nope, that\'s not a valid easter egg. Try again!';
                    },
                    parse: (tag) => tag.toLowerCase()
                }
            ]
        });
    }

    run(msg, args) {
        const { tag } = args;
        return msg.say(eastereggs[tag]);
    }
};
