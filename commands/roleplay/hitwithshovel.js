const { Command } = require('discord.js-commando');

module.exports = class HitwithShovelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'hitwithshovel',
            group: 'roleplay',
            memberName: 'hitwithsovel',
            description: 'Hits something/someone with a shovel.',
            args: [
                {
                    key: 'thing',
                    prompt: 'What do you want to roleplay with?',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, args) {
        const { thing } = args;
        return msg.say(`${msg.author} *hits* ${thing} *with a shovel*`);
    }
};
