const { Command } = require('discord.js-commando');

module.exports = class CanYouNotCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'canyounot',
            group: 'random',
            memberName: 'canyounot',
            description: 'Can YOU not?'
        });
    }

    run(message) {
        return message.say('Can YOU not?');
    }
};
