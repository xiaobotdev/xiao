const { Command } = require('discord.js-commando');
const morse = require('morse');

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
                    if (morse.encode(content).length < 1900) {
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
        const toMorse = args.text;
        const morseEncoded = morse.encode(toMorse);
        return message.say(morseEncoded);
    }
};
