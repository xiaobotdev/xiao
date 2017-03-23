const commando = require('discord.js-commando');

module.exports = class PokeCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'poke',
            group: 'roleplay',
            memberName: 'poke',
            description: 'Pokes someone. (;poke @User)',
            examples: [';poke @User']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let thingToRoleplay = message.content.split(" ").slice(1).join(" ");
        message.channel.send(`${message.author} *pokes* ${thingToRoleplay}`);
    }
};
