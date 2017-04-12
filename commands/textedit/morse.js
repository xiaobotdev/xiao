const { Command } = require('discord.js-commando');
const translator = require('../../functions/translator.js');
const morse = {
    "a": ".-",
    "b": "-...",
    "c": "-.-.",
    "d": "-..",
    "e": ".",
    "f": "..-.",
    "g": "--.",
    "h": "....",
    "i": "..",
    "j": ".---",
    "k": "-.-",
    "l": ".-..",
    "m": "--",
    "n": "-.",
    "o": "---",
    "p": ".--.",
    "q": "--.-",
    "r": ".-.",
    "s": "...",
    "t": "-",
    "u": "..-",
    "v": "...-",
    "w": ".--",
    "x": "-..-",
    "y": "-.--",
    "z": "--..",
    "0": "-----",
    "1": ".----",
    "2": "..---",
    "3": "...--",
    "4": "....-",
    "5": ".....",
    "6": "-....",
    "7": "--...",
    "8": "---..",
    "9": "----.",
    " ": "/",
    ".": ".-.-.-",
    "?": "..--..",
    ",": "--..--",
    "'": ".----."
};

module.exports = class MorseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'morse',
            aliases: [
                'morsecode'
            ],
            group: 'textedit',
            memberName: 'morse',
            description: 'Translates text to morse code. (;morse This is Morse Code.)',
            examples: [';morse This is Morse Code.'],
            args: [{
                key: 'text',
                prompt: 'What text would you like to convert to morse?',
                type: 'string',
                validate: content => {
                    if (translator.letterTrans(content, morse).length < 1900) {
                        return true;
                    }
                    return 'Your text to encode is too long.';
                }
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const text = args.text.toLowerCase();
        const encoded = translator.letterTrans(text, morse);
        return message.say(encoded);
    }
};
