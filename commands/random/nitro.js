const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class NitroCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'nitro',
            group: 'random',
            memberName: 'nitro',
            description: 'Sends a "This Message Can Only be viewed by Nitro Members" message.'
        });
    }

    run(msg) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        const embed = new RichEmbed()
            .setAuthor('Discord Nitro')
            .setThumbnail('https://pbs.twimg.com/profile_images/814184180649197568/y2eZcVMq.jpg')
            .setColor(0x748BD9)
            .setURL('https://discordapp.com/nitro')
            .setDescription(stripIndents`
                This Message can only be viewed by members with Discord Nitro.
                [More Information](https://discordapp.com/nitro)
            `);
        return msg.embed(embed);
    }
};
