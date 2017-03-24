const commando = require('discord.js-commando');
const romanNumeralConverter = require('roman-numeral-converter-mmxvi');

module.exports = class RomanCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'roman',
            group: 'numedit',
            memberName: 'roman',
            description: 'Converts numbers to Roman Numerals. (;roman 2)',
            examples: [';roman 2']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let numberToRoman = message.content.split(" ").slice(1).join(" ");
        let romanInterger = Number(numberToRoman);
        if (romanInterger > 1000000) {
            message.channel.send(':x: Error! Number is too high!');
        }
        else {
            try {
                message.channel.send(romanNumeralConverter.getRomanFromInteger(romanInterger));
            }
            catch (err) {
                message.channel.send(':x: Error! Something went wrong! Perhaps you entered nothing?');
            }
        }
    }
};
