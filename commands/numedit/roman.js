const commando = require('discord.js-commando');
const romanNumeralConverter = require('roman-numeral-converter-mmxvi');

class RomanCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'roman', 
            group: 'numedit',
            memberName: 'roman',
            description: 'Converts numbers to Roman Numerals. (;roman 2)',
            examples: [';roman 2']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let messagecontent = message.content.split(" ").slice(1).join(" ");
        let numberified = Number(messagecontent);
        if(numberified > 10000) {
            message.channel.sendMessage(':x: Error! Number is too high!');
        } else {
            message.channel.sendMessage(romanNumeralConverter.getRomanFromInteger(numberified)).catch(error => message.channel.sendMessage(':x: Error! Something went wrong! Perhaps you entered nothing?'));
        }
    }
}

module.exports = RomanCommand;