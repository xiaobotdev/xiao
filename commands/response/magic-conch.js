const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const answers = require('../../assets/json/magic-conch');

module.exports = class MagicConchCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'magic-conch',
            group: 'response',
            memberName: 'magic-conch',
            description: 'Maybe Someday...',
            args: [
                {
                    key: 'question',
                    prompt: 'What do you want to ask the magic conch?',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, args) {
        const { question } = args;
        const answer = answers[Math.floor(Math.random() * answers.length)];
        return msg.say(stripIndents`
            Question: ${question}
            :shell: ${answer} :shell:
        `);
    }
};
