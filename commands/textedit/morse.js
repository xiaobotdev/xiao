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
                validate: (str) => {
                    str.toLowerCase() === 'encode' || str.toLowerCase() === 'decode';
                }
            }, {
                key: 'text',
                prompt: 'What text would you like to convert to morse?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let methodToUse = args.method;
        let toMorse = args.text;
        if (methodToUse === 'encode') return message.channel.send(morse.encode(toMorse)).catch(error => message.channel.send(':x: Error! Something went wrong! Perhaps you entered incorrect text?'));
        if (methodToUse === 'decode') return message.channel.send(morse.decode(toMorse)).catch(error => message.channel.send(':x: Error! Something went wrong! Perhaps you entered incorrect text?'));
    }
};
