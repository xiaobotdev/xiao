const Command = require('../../structures/Command');

module.exports = class RouletteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roulette',
            group: 'response',
            memberName: 'roulette',
            description: 'Chooses a random member in the server.',
            guildOnly: true
        });
    }

    run(msg) {
        return msg.say(`I choose ${msg.guild.members.random().displayName}!`);
    }
};
