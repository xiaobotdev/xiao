const { Command } = require('discord.js-commando');
const { stripIndent } = require('common-tags');

module.exports = class CowsayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cowsay',
            group: 'textedit',
            memberName: 'cowsay',
            description: 'Converts text to cowsay.',
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like the cow to say?',
                    type: 'string',
                    validate: text => {
                        if (text.length < 1500)
                            return true;
                        return `Please keep your content under 1500 characters, you have ${text.length}.`;
                    }
                }
            ]
        });
    }

    run(msg, args) {
        const { text } = args;
        return msg.code(null, 
            stripIndent`
                < ${text} >
                   \\   ^__^
                    \\  (oO)\\_______
                       (__)\\       )\\/\\
                         U  ||----w |
                            ||     ||
            `
        );
    }
};
