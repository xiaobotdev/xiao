const { Command } = require('discord.js-commando');

module.exports = class RandomPunCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pun',
            group: 'response',
            memberName: 'pun',
            description: 'Sends a random pun image. (;pun)',
            examples: [';pun']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return message.say(':x: Error! I don\'t have the Attach Files Permission!');
        }
        let pun = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.png', '9.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg', '21.jpg', '22.jpg', '23.jpg', '24.jpg', '25.jpg', '26.jpg', '27.jpg', '28.jpg', '29.jpg', '30.jpeg', '31.jpg', '32.jpg', '33.jpg', '34.png', '35.jpg', '36.jpg', '37.jpg', '38.jpg', '39.jpg', '40.jpg', '41.jpg', '42.jpg', '43.jpg', '44.jpg', '45.gif', '46.jpg', '47.jpg', '48.jpg', '49.jpg', '50.jpg', '51.jpg', '52.jpg', '53.jpg'];
        pun = pun[Math.floor(Math.random() * pun.length)];
        return message.channel.sendFile(`./images/Pun${pun}`);
    }
};
