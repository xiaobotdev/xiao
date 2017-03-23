const commando = require('discord.js-commando');

module.exports = class GiveFlowerCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'giveflower',
            aliases: [
                'present',
                'gift'
            ],
            group: 'random',
            memberName: 'giveflower',
            description: 'Gives Xiao Pai a flower. (;giveflower)',
            examples: [';giveflower']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        message.channel.send('Ooh, what a pretty flower. What, I may have it? Thanks! I like flowers, yes? ♪');
    }
};
