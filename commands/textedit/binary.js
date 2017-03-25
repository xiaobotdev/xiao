const commando = require('discord.js-commando');
const stringToBinary = require('string-to-binary');

module.exports = class BinaryCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'binary',
            group: 'textedit',
            memberName: 'binary',
            description: 'Converts text to binary. (;binary This text)',
            examples: [';binary This text'],
            args: [{
                key: 'text',
                prompt: 'What text would you like to convert to binary?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let turnToBinary = args.text;
        let binaryText = stringToBinary(turnToBinary);
        if (binaryText.length > 1950) return message.channel.send(":x: Error! Your message is too long!");
        return message.channel.send(binaryText);
    }
};
