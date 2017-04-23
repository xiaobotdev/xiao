const { Command } = require('discord.js-commando');

module.exports = class MotivateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'motivate',
            aliases: [
                'encourage',
                'justdoit'
            ],
            group: 'random',
            memberName: 'motivate',
            description: 'Motivates something/someone.',
            args: [{
                key: 'thing',
                prompt: 'What do you want to motivate?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const { thing } = args;
        return message.say(`${thing}, https://www.youtube.com/watch?v=ZXsQAXx_ao0`);
    }
};
