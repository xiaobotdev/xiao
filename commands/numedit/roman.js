const { Command } = require('discord.js-commando');
const { getRomanFromInteger } = require('roman-numeral-converter-mmxvi');

module.exports = class RomanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roman',
            group: 'numedit',
            memberName: 'roman',
            description: 'Converts numbers to Roman Numerals. (;roman 2)',
            examples: [';roman 2'],
            args: [{
                key: 'number',
                prompt: 'What do you want to convert to Roman?',
                type: 'integer',
                validate: number => {
                    if (number < 1000001 && number > 0) {
                        return true;
                    }
                    return 'Please enter a number below one million and above zero.';
                }
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const number = args.number;
        const roman = getRomanFromInteger(number);
        return message.say(roman);
    }
};
