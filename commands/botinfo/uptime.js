const commando = require('discord.js-commando');

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
        const toHHMMSS = seconds => {
            let secNum = parseInt(seconds, 10);
            let hours = Math.floor(secNum / 3600);
            let minutes = Math.floor((secNum - (hours * 3600)) / 60);
            seconds = secNum - (hours * 3600) - (minutes * 60);
            if (hours < 10) hours = "0" + hours;
            if (minutes < 10) minutes = "0" + minutes;
            if (seconds < 10) seconds = "0" + seconds;
            return hours + "Hours, " + minutes + "Minutes, and " + seconds + "Seconds";
        };
        let guilds = this.client.guilds.array().length;
        message.channel.sendMessage("I've been active on this shard for: " + toHHMMSS(process.uptime()) + " in a total of " + guilds + " Servers.");
    }
}

module.exports = UptimeCommand;