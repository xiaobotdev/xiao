const commando = require('discord.js-commando');

module.exports = class ReverseCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'reverse',
            group: 'textedit',
            memberName: 'reverse',
            description: 'Reverses text (;reverse This text please)',
            examples: [';reverse This text please'],
            args: [{
                key: 'text',
                prompt: 'What text would you like to reverse?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let stringToReverse = args.text;
        let reversed = stringToReverse.split("").reverse().join("");
        return message.channel.send(reversed);
    }
};
