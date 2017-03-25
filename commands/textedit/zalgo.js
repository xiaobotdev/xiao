const commando = require('discord.js-commando');
const zalgo = require('zalgolize');

module.exports = class ZalgoCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'zalgo',
            group: 'textedit',
            memberName: 'zalgo',
            description: 'Zalgoizes Text (;zalgo This Text)',
            examples: [';zalgo This Text'],
            args: [{
                key: 'text',
                prompt: 'What text would you like to convert to zalgo?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let zalgoified = zalgo(args.text);
        if (zalgoified.length > 1950) return message.channel.send(":x: Error! Your message is too long!");
        return message.channel.send(zalgoified);
    }
};
