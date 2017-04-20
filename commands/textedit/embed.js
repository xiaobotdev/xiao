const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class EmbedCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'embed',
            group: 'textedit',
            memberName: 'embed',
            description: 'Sends a message in an embed. (x;embed This is an example.)',
            examples: ['x;embed This is an example.'],
            guildOnly: true,
            args: [{
                key: 'text',
                prompt: 'What text would you like to embed?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
            if (!message.channel.permissionsFor(this.client.user).hasPermission('MANAGE_MESSAGES')) return message.say(':x: Error! I don\'t have the Manage Messages Permission!');
        }
        const { text } = args;
        const embed = new RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setColor(0x00AE86)
            .setTimestamp()
            .setDescription(text);
        message.delete();
        return message.embed(embed);
    }
};
