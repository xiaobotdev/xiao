const { Command } = require('discord.js-commando');

module.exports = class RouletteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roulette',
            aliases: [
                'randommember',
                'randomuser',
                'pickmember',
                'pickuser'
            ],
            group: 'response',
            memberName: 'roulette',
            description: 'Chooses a random member in the server.',
            guildOnly: true
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        return message.say(`I choose ${message.guild.members.random().displayName}!`);
    }
};
