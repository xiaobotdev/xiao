const { Command } = require('discord.js-commando');

module.exports = class RateWaifuCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ratewaifu',
            aliases: [
                'waifu'
            ],
            group: 'response',
            memberName: 'ratewaifu',
            description: 'Rates your Waifu. (x;ratewaifu Xiao Pai)',
            examples: ['x;ratewaifu Xiao Pai'],
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
        const { waifu } = args;
        const rating = Math.floor(Math.random() * 10) + 1;
        return message.say(`I'd give ${waifu} a ${rating}/10!`);
    }
};
