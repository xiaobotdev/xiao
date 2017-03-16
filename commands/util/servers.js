const commando = require('discord.js-commando');

class ServersCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'servers', 
            group: 'util',
            memberName: 'servers',
            description: "Sends a list of all server names and IDs to the log.",
            examples: [";servers"]
        });
    }
	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
	    console.log(this.client.guilds.array().length + " Servers: " + this.client.guilds.map(g => g.name + " (" + g.id + ")").join(", "));
        message.channel.send("Sent the information to the console!");
    }
}

module.exports = ServersCommand;