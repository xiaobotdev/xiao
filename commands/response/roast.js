const { Command } = require('discord.js-commando');
const roasts = require('./roasts');

module.exports = class RoastCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roast',
            group: 'response',
            memberName: 'roast',
            description: 'Roasts something/someone.',
            args: [{
                key: 'thing',
                prompt: 'What do you want to roast?',
                type: 'string'
            }]
        });
    }

    run(msg, args) {
        const { thing } = args;
        const roast = roasts[Math.floor(Math.random() * roasts.length)];
        return msg.say(`${thing}, ${roast}`);
    }
};
