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
            description: 'Gets a random would you rather question. (;wouldyourather)',
            examples: [';wouldyourather']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        try {
            const response = await request
                .get('http://www.rrrather.com/botapi');
            const data = response.body;
            const embed = new RichEmbed()
                .setTitle(`${data.title}...`)
                .setURL(data.link)
                .setColor(0x9797FF)
                .setDescription(`${data.choicea} OR ${data.choiceb}?`);
            return message.embed(embed);
        } catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
