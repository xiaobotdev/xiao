const commando = require('discord.js-commando');

module.exports = class KillCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'kill',
            group: 'roleplay',
            memberName: 'kill',
            description: 'Kills someone. (;kill @User)',
            examples: [';kill @User'],
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
        const thingToRoleplay = args.thing;
        return message.say(`${message.author} *kills* ${thingToRoleplay}`);
    }
};
