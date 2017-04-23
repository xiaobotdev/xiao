const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class NitroCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'nitro',
            group: 'random',
            memberName: 'nitro',
            description: 'Sends a "This Message Can Only be viewed by Nitro Members" message.'
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        const embed = new RichEmbed()
            .setAuthor('Discord Nitro')
            .setThumbnail('https://pbs.twimg.com/profile_images/814184180649197568/y2eZcVMq.jpg')
            .setColor(0x748BD9)
            .setURL('https://discordapp.com/nitro')
            .setDescription('This Message can only be viewed by members with Discord Nitro.\n\n\n[More Information](https://discordapp.com/nitro)');
        return message.embed(embed);
    }
};
