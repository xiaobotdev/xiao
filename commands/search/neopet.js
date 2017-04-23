const { Command } = require('discord.js-commando');
const request = require('superagent');
const cheerio = require('cheerio');

module.exports = class NeopetCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'neopet',
            group: 'search',
            memberName: 'neopet',
            description: 'Gives a Neopet\'s image, searchable by name.',
            args: [{
                key: 'pet',
                prompt: 'What pet would you like to get the image of?',
                type: 'string',
                parse: text => {
                    return encodeURIComponent(text);
                }
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return message.say(':x: Error! I don\'t have the Attach Files Permission!');
        }
        const { pet } = args;
        try {
            const { text } = await request
                .get(`http://www.sunnyneo.com/petimagefinder.php?name=${pet}&size=5&mood=1`);
            const $ = cheerio.load(text);
            const link = $('textarea').first().text();
            if (!link.includes('cp')) return message.say(':x: Error! Pet not found!');
            return message.say(link);
        } catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
