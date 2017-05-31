const Command = require('../../structures/Command');

module.exports = class EmojiCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'emoji',
            group: 'guildinfo',
            memberName: 'emoji',
            description: 'Gives a list of the server\'s custom emoji.',
            guildOnly: true
        });
    }

    run(msg) {
        return msg.say(msg.guild.emojis.map(e => e).join(''))
            .catch(() => msg.say('There was an error sending the emoji.'));
    }
};
