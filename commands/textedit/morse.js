const commando = require('discord.js-commando');
const morse = require('morse');

module.exports = class MorseCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'morse',
            aliases: [
                'morsecode'
            ],
            group: 'textedit',
            memberName: 'morse',
            description: 'Translates text to and from morse code. (;morse encode This is Morse Code.)',
            examples: [';morse encode This is Morse Code.', ';morse decode .... . .-.. .-.. --- --..-- ....... .-- --- .-. .-.. -.. .-.-.-'],
            args: [{
                key: 'method',
                prompt: 'Would you like to encode or decode the text?',
                type: 'string',
                validate: method => {
                    if (method.toLowerCase() === 'encode' || method.toLowerCase() === 'decode') {
                        return true;
                    }
                    return 'Please enter either `encode` or `decode`.';
                }
            }, {
                key: 'text',
                prompt: 'What text would you like to convert to/from morse?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        const methodToUse = args.method.toLowerCase();
        const toMorse = args.text;
        if (methodToUse === 'encode') {
            return message.say(morse.encode(toMorse)).catch(error => message.say(':x: Error! Something went wrong! Perhaps you entered incorrect text?'));
        }
        else if (methodToUse === 'decode') {
            return message.say(morse.decode(toMorse)).catch(error => message.say(':x: Error! Something went wrong! Perhaps you entered incorrect text?'));
        }
    }
};
