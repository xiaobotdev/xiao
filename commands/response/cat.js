const commando = require('discord.js-commando');

module.exports = class CatCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'cat',
            group: 'response',
            memberName: 'cat',
            description: 'Sends a random cat picture. (;cat)',
            examples: [';cat']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return message.say(':x: Error! I don\'t have the Attach Files Permission!');
        }
        let cat = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpeg', '12.jpg', '13.jpeg', '14.png', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
        cat = cat[Math.floor(Math.random() * cat.length)];
        return message.channel.sendFile(`./images/Cat${cat}`);
    }
};
