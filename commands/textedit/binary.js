const { Command } = require('discord.js-commando');
const binary = (str) => {
    return unescape(encodeURIComponent(str))
        .split('').map(str => {
            const binary = str.charCodeAt(0).toString(2);
            return `${'00000000'.slice(binary.length)}${binary}`;
        }).join('');
};

module.exports = class BinaryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'binary',
            group: 'textedit',
            memberName: 'binary',
            description: 'Converts text to binary.',
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like to convert to binary?',
                    type: 'string',
                    validate: text => {
                        if (binary(text).length < 2000)
                            return true;
                        return 'Your message content is too long.';
                    },
                    parse: text => binary(text)
                }
            ]
        });
    }

    run(msg, args) {
        const { text } = args;
        return msg.say(text);
    }
};
