const commando = require('discord.js-commando');
const pirateSpeak = require('pirate-speak');

module.exports = class PirateCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'pirate',
            aliases: [
                'piratespeak',
                'yarr'
            ],
            group: 'textedit',
            memberName: 'pirate',
            description: 'Talk like a pirate! (;pirate This is being said like a pirate!)',
            examples: [';pirate This is being said like a pirate!']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let turnToPirate = message.content.split(" ").slice(1).join(" ");
        let pirate = pirateSpeak.translate(turnToPirate);
        if (!turnToPirate) {
            return message.channel.send(":x: Error! Nothing to translate!");
        }
        else {
            if (pirate.length > 1950) {
                return message.channel.send(":x: Error! Your message is too long!");
            }
            else {
                return message.channel.send(pirate);
            }
        }
    }
};
