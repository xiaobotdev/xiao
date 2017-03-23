const commando = require('discord.js-commando');

module.exports = class FishyCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'fishy',
            aliases: [
                'fishing',
                'fish'
            ],
            group: 'response',
            memberName: 'fishy',
            description: 'Catches a fish. (;fishy)',
            examples: [';fishy']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log("[Command] " + message.content);
        let fish = [':fish:', ':tropical_fish:', ':blowfish:'];
        fish = fish[Math.floor(Math.random() * fish.length)];
        message.channel.send("You caught a: " + fish);
    }
};
