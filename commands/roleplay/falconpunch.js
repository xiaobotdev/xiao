const commando = require('discord.js-commando');

module.exports = class FalconPunchCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'falconpunch',
            group: 'roleplay',
            memberName: 'falconpunch',
            description: 'Falcon Punches someone. (;falconpunch @User)',
            examples: [';falconpunch @User'],
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
        return message.channel.send(`${message.author} *falcon punches* ${thingToRoleplay}`);
    }
};
