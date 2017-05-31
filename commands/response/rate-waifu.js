const Command = require('../../structures/Command');

module.exports = class RateWaifuCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rate-waifu',
            aliases: ['waifu'],
            group: 'response',
            memberName: 'rate-waifu',
            description: 'Rates your Waifu.',
            args: [
                {
                    key: 'waifu',
                    prompt: 'Who do you want to rate?',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, args) {
        const { waifu } = args;
        const rating = Math.floor(Math.random() * 10) + 1;
        return msg.say(`I'd give ${waifu} a ${rating}/10!`);
    }
};
