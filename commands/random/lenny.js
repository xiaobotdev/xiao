const commando = require('discord.js-commando');

module.exports = class LennyCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'lenny',
            group: 'random',
            memberName: 'lenny',
            description: 'Responds with the lenny face. (;lenny)',
            examples: [';lenny']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        return message.channel.send('( ͡° ͜ʖ ͡°)');
    }
};
