const { Command } = require('discord.js-commando');

module.exports = class CowsayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cowsay',
            group: 'textedit',
            memberName: 'cowsay',
            description: 'Converts text to cowsay. (x;cowsay This text)',
            examples: ['x;cowsay This text'],
            args: [{
                key: 'text',
                prompt: 'What text would you like the cow to say?',
                type: 'string',
                validate: text => {
                    if (text.length < 1500) {
                        return true;
                    }
                    return `Please keep your content under 1500 characters, you have ${text.length}.`;
                }
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const { text } = args;
        return message.code(null, `< ${text} >\n       \\   ^__^\n        \\  (oO)\\_______\n           (__)\\       )\\/\\\n             U  ||----w |\n                ||     ||`);
    }
};
