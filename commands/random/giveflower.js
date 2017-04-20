const { Command } = require('discord.js-commando');

module.exports = class GiveFlowerCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'giveflower',
            aliases: [
                'present',
                'gift'
            ],
            group: 'random',
            memberName: 'giveflower',
            description: 'Gives Xiao Pai a flower. (x;giveflower)',
            examples: ['x;giveflower']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        return message.say('Ooh, what a pretty flower. What, I may have it? Thanks! I like flowers, yes? ♪');
    }
};
