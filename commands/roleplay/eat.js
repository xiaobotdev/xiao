const commando = require('discord.js-commando');

module.exports = class EatCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'eat',
            group: 'roleplay',
            memberName: 'eat',
            description: 'Eats something/someone. (;eat @User)',
            examples: [';eat @User'],
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
        return message.channel.send(`${message.author} *eats* ${thingToRoleplay}`);
    }
};
