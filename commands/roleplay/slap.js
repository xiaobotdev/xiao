const commando = require('discord.js-commando');

module.exports = class SlapCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'slap',
            group: 'roleplay',
            memberName: 'slap',
            description: 'Slaps someone. (;slap @User)',
            examples: [';slap @User']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let thingToRoleplay = message.content.split(" ").slice(1).join(" ");
        return message.channel.send(`${message.author} *slaps* ${thingToRoleplay}`);
    }
};
