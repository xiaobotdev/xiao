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
        const emojis = msg.guild.emojis;
        if (!emojis.size) return msg.say('You have no Custom Emoji.');
        return msg.say(emojis.map((emoji) => emoji).join(''));
    }
};
