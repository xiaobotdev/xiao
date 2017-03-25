const commando = require('discord.js-commando');

module.exports = class CoinFlipCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
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
        console.log(`[Command] ${message.content}`);
        let coin = ['heads', 'tails'];
        coin = coin[Math.floor(Math.random() * coin.length)];
        return message.say(`It landed on ${coin}!`);
    }
};
