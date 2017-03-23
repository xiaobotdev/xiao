const commando = require('discord.js-commando');

module.exports = class InhaleCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'inhale',
            group: 'roleplay',
            memberName: 'inhale',
            description: 'Inhales someone. (;inhale @User)',
            examples: [';inhale @User']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let thingToRoleplay = message.content.split(" ").slice(1).join(" ");
        return message.channel.send(`${message.author} *inhales* ${thingToRoleplay} *but gained no ability...*`);
    }
};
