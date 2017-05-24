const { Command } = require('discord.js-commando');
const binary = (str) => {
    return unescape(encodeURIComponent(str))
        .split('').map(str => {
            const binary = str.charCodeAt(0).toString(2);
            return `${'00000000'.slice(binary.length)}${binary}`;
        }).join('');
};
const { wordTrans } = require('custom-translate');
const dictionary = require('../../assets/json/finger-binary');

module.exports = class FingerBinaryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'finger-binary',
            group: 'textedit',
            memberName: 'finger-binary',
            description: 'Converts text to finger binary.',
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like to convert to finger binary?',
                    type: 'string',
                    validate: text => {
                        if (wordTrans(binary(text).match(/.{1,5}/g).join(' '), dictionary, '').length < 2000) return true;
                        return 'Your text is too long.';
                    },
                    parse: text => wordTrans(binary(text).match(/.{1,5}/g).join(' '), dictionary, '')
                }
            ]
        });
    }

    run(msg, args) {
        const { text } = args;
        return msg.say(text);
    }
};
