const commando = require('discord.js-commando');

module.exports = class HitwithShovelCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'hitwithshovel',
            group: 'roleplay',
            memberName: 'hitwithsovel',
            description: 'Hits someone with a shovel. (;hitwithshovel @User)',
            examples: [';hitwithshovel @User']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let thingToRoleplay = message.content.split(" ").slice(1).join(" ");
        return message.channel.send(`${message.author} *hits* ${thingToRoleplay} *with a shovel*`);
    }
};
