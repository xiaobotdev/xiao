const commando = require('discord.js-commando');

module.exports = class SlapCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'slap',
            group: 'roleplay',
            memberName: 'slap',
            description: 'Slaps someone. (;slap @User)',
            examples: [';slap @User'],
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
        console.log(`[Command] ${message.content}`);
        let thingToRoleplay = args.thing;
        return message.say(`${message.author} *slaps* ${thingToRoleplay}`);
    }
};
