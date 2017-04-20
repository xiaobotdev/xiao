const { Command } = require('discord.js-commando');
const xiaos = require('./xiaos.json');

module.exports = class XiaoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'xiaopai',
            aliases: [
                'xiao'
            ],
            group: 'randomimg',
            memberName: 'xiaopai',
            description: 'Sends a random image of Xiao Pai. (x;xiaopai)',
            examples: ['x;xiaopai']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return message.say(':x: Error! I don\'t have the Attach Files Permission!');
        }
        const xiao = xiaos[Math.floor(Math.random() * xiaos.length)];
        return message.channel.send({files: [`./images/Xiao${xiao}`]});
    }
};
