const commando = require('discord.js-commando');

module.exports = class ServersCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'servers',
            aliases: [
                'serverlist'
            ],
            group: 'util',
            memberName: 'servers',
            description: "Sends a list of all server names and IDs to the log.",
            examples: [";servers"]
        });
    }
    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let guildCount = this.client.guilds.size;
        let guildNames = this.client.guilds.map(g => `${g.name} (${g.id})`).join(", ");
        console.log(`${guildCount} Servers: ${guildNames}`);
        return message.channel.send("Sent the information to the console!");
    }
};
