const { Command } = require('discord.js-commando');
const sides = ['heads', 'tails'];

module.exports = class CoinFlipCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'coin',
            aliases: [
                'coinflip',
                'flip'
            ],
            group: 'response',
            memberName: 'coin',
            description: 'Flips a coin.'
        });
    }

    run(message) {
        const side = sides[Math.floor(Math.random() * sides.length)];
        return message.say(`It landed on ${side}!`);
    }
};
