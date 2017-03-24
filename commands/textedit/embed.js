const commando = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class EmbedCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'embed',
            group: 'textedit',
            memberName: 'embed',
            description: 'Sends a message in an embed. (;embed This is an example.)',
            examples: [';embed This is an example.']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let embedMessage = message.content.split(" ").slice(1).join(" ");
        if (!embedMessage) {
            message.channel.send(":x: Error! Nothing to embed!");
        }
        else {
            if (message.channel.type === 'dm') {
                const embed = new Discord.RichEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setColor(0x00AE86)
                    .setTimestamp()
                    .setDescription(embedMessage);
                message.channel.sendEmbed(embed).catch(console.error);
            }
            else {
                const embed = new Discord.RichEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setColor(0x00AE86)
                    .setTimestamp()
                    .setDescription(embedMessage);
                message.delete();
                message.channel.sendEmbed(embed).catch(console.error);
            }
        }
    }
};
