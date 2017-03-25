const commando = require('discord.js-commando');

module.exports = class MagicBall extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: '8ball',
            group: 'response',
            memberName: '8ball',
            description: 'Predicts your future. (;8ball Am I stupid?)',
            examples: [';8ball <INSERT QUESTION HERE>'],
            args: [{
                key: 'question',
                prompt: 'What do you want to ask the 8 ball?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let question = args.question;
        let answers = ['It seems the answer is yes, yes?', 'It seems the answer is no.', 'It is a little doubtful, yes?', 'It seems it is very likely to be true.'];
        answers = answers[Math.floor(Math.random() * answers.length)];
        return message.say(`Question: ${question}\n:8ball: ${answers} :8ball:`);
    }
};
