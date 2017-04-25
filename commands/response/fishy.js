const { Command } = require('discord.js-commando');
const fishes = [':fish:', ':tropical_fish:', ':blowfish:'];

module.exports = class FishyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'fishy',
            group: 'response',
            memberName: 'fishy',
            description: 'Catches a fish.'
        });
    }

    run(message) {
        const fish = fishes[Math.floor(Math.random() * fishes.length)];
        return message.say(`You caught a: ${fish}`);
    }
};
