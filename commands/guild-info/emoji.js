const Command = require('../../structures/Command');

module.exports = class EmojiCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'emoji',
            group: 'guild-info',
            memberName: 'emoji',
            description: 'Responds with a list of the server\'s custom emoji.',
            guildOnly: true
        });
    }

    run(msg) {
        const emoji = msg.guild.emojis;
        if (!emoji.size) return msg.say('You have no custom emoji.');
        return msg.say(emoji.map((e) => e).join(''));
    }
};
