const { Command } = require('discord.js-commando');
const fishes = [':fish:', ':tropical_fish:', ':blowfish:'];

module.exports = class FishyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'fishy',
            aliases: [
                'fishing',
                'fish'
            ],
            group: 'response',
            memberName: 'fishy',
            description: 'Catches a fish.'
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        
        const fish = fishes[Math.floor(Math.random() * fishes.length)];
        return message.say(`You caught a: ${fish}`);
    }
};
