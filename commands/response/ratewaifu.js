const commando = require('discord.js-commando');

module.exports = class RateWaifuCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'ratewaifu',
            aliases: [
                'waifu'
            ],
            group: 'response',
            memberName: 'ratewaifu',
            description: 'Rates your Waifu. (;ratewaifu Xiao Pai)',
            examples: [';ratewaifu Xiao Pai'],
            args: [{
                key: 'waifu',
                prompt: 'Who do you want to rate?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const waifuToRate = args.waifu;
        const rating = Math.floor(Math.random() * 10) + 1;
        return message.say(`I'd give ${waifuToRate} a ${rating}/10!`);
    }
};
