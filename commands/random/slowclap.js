const commando = require('discord.js-commando');

module.exports = class SlowClapCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'slowclap',
            group: 'random',
            memberName: 'slowclap',
            description: '*Slow Clap*. (;slowclap)',
            examples: [';slowclap']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        message.channel.send('*slow clap*');
    }
};
