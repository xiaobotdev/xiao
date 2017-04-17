const { Command } = require('discord.js-commando');

module.exports = class PotatoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'potato',
            aliases: [
                'tater'
            ],
            group: 'randomimg',
            memberName: 'potato',
            description: 'Sends a random Potato picture. (;potato)',
            examples: [';potato']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return message.say(':x: Error! I don\'t have the Attach Files Permission!');
        }
        let potato = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.gif', '6.png', '7.jpg', '8.jpg', '9.jpg'];
        potato = potato[Math.floor(Math.random() * potato.length)];
        return message.channel.send({file: `./images/Potato${potato}`});
    }
};
