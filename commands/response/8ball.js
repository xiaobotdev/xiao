const commando = require('discord.js-commando');

module.exports = class MagicBallCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: '8ball',
            group: 'response',
            memberName: '8ball',
            description: 'Predicts your future. (;8ball Am I stupid?)',
            examples: [';8ball Am I stupid?'],
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
        const question = args.question;
        let answers = ['It is certain', 'It is decidedly so', 'Without a doubt', 'Yes definitely', 'You may rely on it', 'As I see it, yes', 'Most likely', 'Outlook good', 'Yes', 'Signs point to yes', 'Reply hazy try again', 'Ask again later', 'Better not tell you now', 'Cannot predict now', 'Concentrate and ask again', 'Don\'t count on it', 'My reply is no', 'My sources say no', 'Outlook not so good', 'Very doubtful'];
        answers = answers[Math.floor(Math.random() * answers.length)];
        return message.say(`Question: ${question}\n:8ball: ${answers} :8ball:`);
    }
};
