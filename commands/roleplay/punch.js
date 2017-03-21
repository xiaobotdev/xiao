const commando = require('discord.js-commando');

module.exports = class PunchCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'punch',
            group: 'roleplay',
            memberName: 'punch',
            description: 'Punches someone. (;punch @User)',
            examples: [';punch @User']
        });
    }

    async run(message) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log("[Command] " + message.content);
        let thingToRoleplay = message.content.split(" ").slice(1).join(" ");
        message.channel.send(message.author + ' *punches* ' + thingToRoleplay);
    }
};