const { Command } = require('discord.js-commando');

module.exports = class GiveFlowerCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'giveflower',
            group: 'random',
            memberName: 'giveflower',
            description: 'Gives Xiao Pai a flower.'
        });
    }

    run(message) {
        return message.say('Ooh, what a pretty flower. What, I may have it? Thanks! I like flowers, yes? ♪');
    }
};
