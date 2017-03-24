const commando = require('discord.js-commando');

module.exports = class PotatoCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'potato',
            group: 'response',
            memberName: 'potato',
            description: 'Sends a random Potato picture. (;potato)',
            examples: [';potato']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'ATTACH_FILES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let potato = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.gif", "6.png", "7.jpg", "8.jpg", "9.jpg"];
        potato = potato[Math.floor(Math.random() * potato.length)];
        return message.channel.sendFile(`./images/Potato${potato}`);
    }
};
