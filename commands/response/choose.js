const { Command } = require('discord.js-commando');

module.exports = class ChooseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'choose',
            group: 'response',
            memberName: 'choose',
            description: 'Chooses between things.',
            args: [
                {
                    key: 'choices',
                    prompt: 'What choices do you want me pick from?',
                    type: 'string',
                    infinite: true
                }
            ]
        });
    }

    run(msg, args) {
        const { choices } = args;
        const choice = choices[Math.floor(Math.random() * choices.length)];
        return msg.say(`I choose ${choice}!`);
    }
};
