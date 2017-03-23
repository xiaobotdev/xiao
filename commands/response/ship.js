const commando = require('discord.js-commando');

module.exports = class ShipCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'ship',
            aliases: [
                'rate'
            ],
            group: 'response',
            memberName: 'ship',
            description: 'Ships two people. (;ship @Rem and @Nate)',
            examples: [';ship @Rem and @Nate']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log("[Command] " + message.content);
        let thingToShip = message.content.split(" ").slice(1).join(" ");
        let percentage = Math.floor(Math.random() * 100) + 1;
        message.channel.send("I'd give " + thingToShip + " a " + percentage + "%!");
    }
};
