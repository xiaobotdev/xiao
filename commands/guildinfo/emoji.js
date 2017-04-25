const { Command } = require('discord.js-commando');

module.exports = class EmojiCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'emoji',
            group: 'guildinfo',
            memberName: 'emoji',
            description: 'Gives a list of the current server\'s custom emoji.',
            guildOnly: true
        });
    }

    run(message) {
        return message.say(message.guild.emojis.map(e => e).join(''))
            .catch(() => message.say('There was an error sending the emoji. Perhaps you have no custom emoji?'));
    }
};
