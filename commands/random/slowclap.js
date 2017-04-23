const { Command } = require('discord.js-commando');

module.exports = class SlowClapCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'slowclap',
            group: 'random',
            memberName: 'slowclap',
            description: '*Slow Clap*.'
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        return message.say('*slow clap*');
    }
};
