const commando = require('discord.js-commando');

module.exports = class CoinFlipCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'coin',
            aliases: [
                'coinflip',
                'flip'
            ],
            group: 'response',
            memberName: 'coin',
            description: 'Flips a coin. (;coin)',
            examples: [';coin']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        let coin = ['heads', 'tails'];
        coin = coin[Math.floor(Math.random() * coin.length)];
        return message.say(`It landed on ${coin}!`);
    }
};
