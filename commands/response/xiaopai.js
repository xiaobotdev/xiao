const commando = require('discord.js-commando');

module.exports = class XiaoCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'xiaopai',
            aliases: [
                'xiao'
            ],
            group: 'response',
            memberName: 'xiaopai',
            description: 'Sends a random image of Xiao Pai. (;xiaopai)',
            examples: [';xiaopai']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return message.say(':x: Error! I don\'t have the Attach Files Permission!');
        }
        let XiaoPai = ['1.png', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.png', '9.png', '10.png', '11.png', '12.png', '13.jpg', '14.jpg', '15.png', '16.jpg', '17.png', '18.gif', '19.png', '20.jpg', '21.jpg'];
        XiaoPai = XiaoPai[Math.floor(Math.random() * XiaoPai.length)];
        return message.channel.sendFile(`./images/Xiao${XiaoPai}`);
    }
};
