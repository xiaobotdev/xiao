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

    run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        const { text } = args;
        const embed = new RichEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
            .setColor(0x00AE86)
            .setTimestamp()
            .setDescription(text);
        return msg.embed(embed);
    }
};
