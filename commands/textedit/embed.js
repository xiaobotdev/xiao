const commando = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class EmbedCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'embed',
            group: 'textedit',
            memberName: 'embed',
            description: 'Sends a message in an embed. (;embed This is an example.)',
            examples: [';embed This is an example.'],
            guildOnly: true,
            args: [{
                key: 'text',
                prompt: 'What text would you like to embed?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        const embedMessage = args.text;
        const embed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setColor(0x00AE86)
            .setTimestamp()
            .setDescription(embedMessage);
        await message.delete();
        return message.embed(embed);
    }
};
