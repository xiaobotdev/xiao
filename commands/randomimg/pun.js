const { Command } = require('discord.js-commando');
const puns = require('./puns.json');

module.exports = class RandomPunCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pun',
            group: 'randomimg',
            memberName: 'pun',
            description: 'Sends a random pun image.'
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return message.say(':x: Error! I don\'t have the Attach Files Permission!');
        }
        const pun = puns[Math.floor(Math.random() * puns.length)];
        return message.channel.send({files: [`./images/Pun${pun}`]});
    }
};
