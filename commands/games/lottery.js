const commando = require('discord.js-commando');

module.exports = class LotteryCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'lottery',
            group: 'games',
            memberName: 'lottery',
            description: '1 in 100 Chance of Winning. Winners get... The feeling of winning? (;lottery)',
            examples: [';lottery']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let lotteryNumber = ['Winner'][Math.floor(Math.random() * 100)];
        if (lotteryNumber !== "Winner") return message.say(`Nope, sorry ${message.author.username}, you lost.`);
        return message.say(`Wow ${message.author.username}! You actually won! Great job!`);
    }
};
