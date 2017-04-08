const commando = require('discord.js-commando');
const moment = require('moment');
require('moment-duration-format');

module.exports = class UptimeCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'uptime',
            group: 'botinfo',
            memberName: 'uptime',
            description: 'Displays how long the bot has been active. (;uptime)',
            examples: [';uptime']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        return message.say(`I've been active on this shard for: **${moment.duration(this.client.uptime).format('d[ days], h[ hours], m[ minutes, and ]s[ seconds]')}** in **${this.client.guilds.size} Servers.**`);
    }
};
