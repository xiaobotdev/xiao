const commando = require('discord.js-commando');
const romanNumeralConverter = require('roman-numeral-converter-mmxvi');

module.exports = class RomanCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
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
                    if (number > 1000000) {
                        return 'Please enter a number below one million.';
                    }
                    return true;
                }
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let numberToRoman = args.number;
        let romanInterger = numberToRoman;
        return message.channel.send(romanNumeralConverter.getRomanFromInteger(romanInterger));
    }
};
