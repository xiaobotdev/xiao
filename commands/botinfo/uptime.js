const commando = require('discord.js-commando');
const moment = require('moment');
require('moment-duration-format');

class UptimeCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'uptime', 
            group: 'botinfo',
            memberName: 'uptime',
            description: 'Displays how long the bot has been active. (;uptime)',
            examples: [';uptime']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let guilds = this.client.guilds.array().length;
        message.channel.sendMessage("I've been active on this shard for: **" + moment.duration(this.client.uptime).format('d[ days], h[ hours], m[ minutes, and ]s[ seconds]') + "** in a total of " + guilds + " Servers.");
    }
}

module.exports = UptimeCommand;