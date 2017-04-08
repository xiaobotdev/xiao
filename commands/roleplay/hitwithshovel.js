const commando = require('discord.js-commando');

module.exports = class HitwithShovelCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'hitwithshovel',
            group: 'roleplay',
            memberName: 'hitwithsovel',
            description: 'Hits someone with a shovel. (;hitwithshovel @User)',
            examples: [';hitwithshovel @User'],
            args: [{
                key: 'thing',
                prompt: 'What do you want to roleplay with?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const thingToRoleplay = args.thing;
        return message.say(`${message.author} *hits* ${thingToRoleplay} *with a shovel*`);
    }
};
