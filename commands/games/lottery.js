const Command = require('../../structures/Command');

module.exports = class LotteryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lottery',
            group: 'games',
            memberName: 'lottery',
            description: '1 in 100 chance of winning. Winners get... The feeling of winning?'
        });
    }

    run(msg) {
        const lottery = Math.floor(Math.random() * 100) + 1;
        if (lottery === 1) return msg.say(`Wow ${msg.author.username}! You actually won! Great job!`);
        else return msg.say(`Nope, sorry ${msg.author.username}, you lost.`);
    }
};
