const commando = require('discord.js-commando');
const stringToBinary = require('string-to-binary');

module.exports = class BinaryCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'binary',
            group: 'textedit',
            memberName: 'binary',
            description: 'Converts text to binary. (;binary This text)',
            examples: [';binary This text']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let turnToBinary = message.content.split(" ").slice(1).join(" ");
        message.channel.send(stringToBinary(turnToBinary)).catch(error => message.channel.send(':x: Error! Translation is too long, or nothing was entered!'));
    }
};
