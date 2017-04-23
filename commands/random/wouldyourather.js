const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class WouldYouRatherCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'wouldyourather',
            aliases: [
                'would-you-rather',
                'wyrather'
            ],
            group: 'random',
            memberName: 'wouldyourather',
            description: 'Gets a random would you rather question.'
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        try {
            const { body } = await request
                .get('http://www.rrrather.com/botapi');
            const embed = new RichEmbed()
                .setTitle(`${body.title}...`)
                .setURL(body.link)
                .setColor(0x9797FF)
                .setDescription(`${body.choicea} OR ${body.choiceb}?`);
            return message.embed(embed);
        } catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
