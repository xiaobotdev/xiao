const commando = require('discord.js-commando');
const Discord = require('discord.js');

class EmbedCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'embed', 
            group: 'textedit',
            memberName: 'embed',
            description: 'Sends a message in an embed. (;embed This is an example.)',
            examples: [';embed This is an example.']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        let embedmessage = message.content.split(" ").slice(1).join(" ");
        if(embedmessage === "") {
            message.channel.sendMessage(":x: Error! Nothing to embed!");
        } else {
            const embed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setColor(0x00AE86)
            .setTimestamp()
            .setDescription(embedmessage);
            message.channel.sendEmbed(embed).catch(console.error);
            if (message.channel.type === 'dm') return;
            message.delete();
        }
    }
}

module.exports = EmbedCommand;