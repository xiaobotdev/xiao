const { Command } = require('discord.js-commando');
const stringToBinary = (str) => {
    const pad = '00000000';
    return unescape(encodeURIComponent(str))
        .split('').map(str => {
            const binary = str.charCodeAt(0).toString(2);
            return `${pad.slice(binary.length)}${binary}`;
        }).join('');
};

module.exports = class BinaryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'binary',
            group: 'textedit',
            memberName: 'binary',
            description: 'Converts text to binary.',
            args: [{
                key: 'text',
                prompt: 'What text would you like to convert to binary?',
                type: 'string',
                validate: content => {
                    if (stringToBinary(content).length < 2000)
                        return true;
                    return 'Your message content is too long.';
                },
                parse: text => stringToBinary(text)
            }]
        });
    }

    run(message, args) {
        const { text } = args;
        return message.say(text);
    }
};
