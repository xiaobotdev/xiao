const commando = require('discord.js-commando');
const zalgo = require('zalgolize');

module.exports = class ZalgoCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'zalgo',
            group: 'textedit',
            memberName: 'zalgo',
            description: 'Zalgoizes Text (;zalgo This Text)',
            examples: [';zalgo This Text']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let zalgoified = zalgo(message.content.split(" ").slice(1).join(" "));
        if (!zalgoified) {
            message.channel.send(":x: Error! Nothing to zalgoify!");
        }
        else if (zalgoified.length > 1950) {
            message.channel.send(":x: Error! Your message is too long!");
        }
        else {
            message.channel.send(zalgoified);
        }
    }
};
