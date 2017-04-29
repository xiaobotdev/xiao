const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class EmbedCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'embed',
            group: 'textedit',
            memberName: 'embed',
            description: 'Sends a message in an embed.',
            args: [{
                key: 'text',
                prompt: 'What text would you like to embed?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return message.say('This Command requires the `Embed Links` Permission.');
        const { text } = args;
        const embed = new RichEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL)
            .setColor(0x00AE86)
            .setTimestamp()
            .setDescription(text);
        return message.embed(embed);
    }
};
