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
            examples: [';pirate This is being said like a pirate!'],
            args: [{
                key: 'text',
                prompt: 'What text would you like to convert to pirate?',
                type: 'string',
                validate: content => {
                    if (pirateSpeak.translate(content).length > 1950) {
                        return 'Your message content is too long.';
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
        const turnToPirate = args.text;
        const pirate = pirateSpeak.translate(turnToPirate);
        if (pirate.length > 1950) return message.say(':x: Error! Your message is too long!');
        return message.say(`\u180E${pirate}`);
    }
};
