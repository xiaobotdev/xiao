const commando = require('discord.js-commando');

module.exports = class SlowClapCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'slowclap',
            group: 'random',
            memberName: 'slowclap',
            description: '*Slow Clap*. (;slowclap)',
            examples: [';slowclap']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        return message.say('*slow clap*');
    }
};
