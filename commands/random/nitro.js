const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class NitroCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'nitro',
            group: 'random',
            memberName: 'nitro',
            description: 'Sends a "This Message Can Only be viewed by Nitro Members" message.',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    run(msg) {
        const embed = new RichEmbed()
            .setAuthor('Discord Nitro')
            .setThumbnail('https://i.imgur.com/wzhMMnl.jpg')
            .setColor(0x748BD9)
            .setURL('https://discordapp.com/nitro')
            .setDescription(stripIndents`
                This Message can only be viewed by members with Discord Nitro.
                [More Information](https://discordapp.com/nitro)
            `);
        return msg.embed(embed);
    }
};
