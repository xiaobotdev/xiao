const { Command } = require('discord.js-commando');

module.exports = class RouletteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roulette',
            group: 'response',
            memberName: 'roulette',
            description: 'Chooses a random member in the server.',
            guildOnly: true
        });
    }

    run(message) {
        return message.say(`I choose ${message.guild.members.random().displayName}!`);
    }
};
