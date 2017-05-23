const { Command } = require('discord.js-commando');

module.exports = class GiveFlowerCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'give-flower',
            group: 'random',
            memberName: 'give-flower',
            description: 'Gives Xiao Pai a flower.'
        });
    }

    run(msg) {
        return msg.say('Ooh, what a pretty flower. What, I may have it? Thanks! I like flowers, yes? ♪');
    }
};
