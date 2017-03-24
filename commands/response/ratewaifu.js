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
            examples: [';ratewaifu Xiao Pai']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let waifuToRate = message.content.split(" ").slice(1).join(" ");
        let rating = Math.floor(Math.random() * 10) + 1;
        return message.channel.send(`I'd give ${waifuToRate} a ${rating}/10!`);
    }
};
