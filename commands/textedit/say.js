const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            aliases: [
                'copy',
                'repeat',
                'echo'
            ],
            group: 'textedit',
            memberName: 'say',
            description: 'Make XiaoBot say what you wish.',
            args: [{
                key: 'text',
                prompt: 'What text would you like XiaoBot to say?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        const { text } = args;
        return message.say(`\u180E${text}`);
    }
};
