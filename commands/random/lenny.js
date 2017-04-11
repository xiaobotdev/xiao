const commando = require('discord.js-commando');

module.exports = class LennyCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'lenny',
            group: 'random',
            memberName: 'lenny',
            description: 'Responds with the lenny face. (;lenny)',
            examples: [';lenny']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        return message.say('( ͡° ͜ʖ ͡°)');
    }
};
