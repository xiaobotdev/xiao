const { Command } = require('discord.js-commando');

module.exports = class SlowClapCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'slowclap',
            group: 'random',
            memberName: 'slowclap',
            description: '*Slow Clap*.'
        });
    }

    run(message) {
        return message.say('*slow clap*');
    }
};
