const commando = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class NitroCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'nitro',
            group: 'random',
            memberName: 'nitro',
            description: 'Sends a "This Message Can Only be viewed by Nitro Members" message. (;nitro)',
            examples: [';nitro']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log("[Command] " + message.content);
        const embed = new Discord.RichEmbed()
            .setAuthor("Discord Nitro")
            .setThumbnail("https://pbs.twimg.com/profile_images/814184180649197568/y2eZcVMq.jpg")
            .setColor(0x748BD9)
            .setURL("https://discordapp.com/nitro")
            .setDescription("This Message can only be viewed by members with Discord Nitro.\n\n\n[More Information](https://discordapp.com/nitro)");
        message.channel.sendEmbed(embed).catch(console.error);
    }
};
