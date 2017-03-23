const commando = require('discord.js-commando');

module.exports = class HugCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'hug',
            group: 'roleplay',
            memberName: 'hug',
            description: 'Hugs someone. (;hug @User)',
            examples: [';hug @User']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log("[Command] " + message.content);
        let thingToRoleplay = message.content.split(" ").slice(1).join(" ");
        message.channel.send(message.author + ' *hugs* ' + thingToRoleplay);
    }
};
