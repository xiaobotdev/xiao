const commando = require('discord.js-commando');

module.exports = class MagicBall extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: '8ball',
            group: 'response',
            memberName: '8ball',
            description: 'Predicts your future. (;8ball Am I stupid?)',
            examples: [';8ball <INSERT QUESTION HERE>']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log("[Command] " + message.content);
        let question = message.content.split(" ").slice(1).join(" ");
        let answers = ['It seems the answer is yes, yes?', 'It seems the answer is no.', 'It is a little doubtful, yes?', 'It seems it is very likely to be true.'];
        answers = answers[Math.floor(Math.random() * answers.length)];
        if (!question) {
            question = "Not Specified.";
        }
        message.channel.send("Question: " + question + "\n:8ball: " + answers + " :8ball:");
    }
};
