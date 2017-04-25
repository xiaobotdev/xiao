const { Command } = require('discord.js-commando');

module.exports = class MotivateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'motivate',
            group: 'random',
            memberName: 'motivate',
            description: 'Motivates something/someone.',
            args: [{
                key: 'thing',
                prompt: 'What do you want to motivate?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        const { thing } = args;
        return message.say(`${thing}, https://www.youtube.com/watch?v=ZXsQAXx_ao0`);
    }
};
