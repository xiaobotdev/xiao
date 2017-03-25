const commando = require('discord.js-commando');

module.exports = class CuddleCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'cuddle',
            group: 'roleplay',
            memberName: 'cuddle',
            description: 'Cuddles someone. (;cuddle @User)',
            examples: [';cuddle @User'],
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
        return message.say(`${message.author} *cuddles* ${thingToRoleplay}`);
    }
};
